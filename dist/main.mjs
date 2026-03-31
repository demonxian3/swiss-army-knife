import fs from "fs";
import path from "path";
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";

const aliasPathMap = {
  "@\\/": "/",
  "@pages\\/": "/pages/",
  "@config\\/": "/config/",
  "@containers\\/": "/containers/",
  "@components\\/": "/components/",
  "@stores\\/": "/stores/",
  "@utils\\/": "/utils/",
  "@common\\/": "/common/",
};

const pushInfos =
  (infos, visitedPath) =>
  (name, path, type, route = null) => {
    if (!name || !path) {
      return;
    }

    const existInfo = infos.find((i) => i.name === name);
    const hasVisited = visitedPath.includes(path);

    if (existInfo && hasVisited && !route) {
      return;
    }

    if (!hasVisited) {
      visitedPath.push(path);
    }

    if (existInfo) {
      existInfo.routes.push(route);
    } else {
      infos.push({
        name,
        path,
        type,
        routes: route ? [route] : [],
      });
    }
  };

// 副作用: 将路径转换为实际可访问的绝对路径，失败返回false
const fixPathEffect = (tree, rootPath, basePath) => {
  if (tree.path.includes("bundle-loader")) {
    tree.path = tree.path.replace(/^bundle-loader(.*?)!/g, "");
  }

  // 别名转换
  if (/^@/.test(tree.path)) {
    Object.keys(aliasPathMap).forEach((alias) => {
      const pattern = new RegExp(alias, "g");
      tree.path = tree.path.replace(pattern, rootPath + aliasPathMap[alias]);
    });
  }

  // 如果是相对路径，通过resolve解析
  if (/^\.+/g.test(tree.path)) {
    tree.path = path.resolve(path.join(basePath, tree.path));
  }

  // 如果是目录，自动补充index
  if (fs.existsSync(tree.path) && fs.statSync(tree.path).isDirectory()) {
    tree.path += "/index";
  }

  // 自动补充后缀
  const autoSuffix = [".tsx", ".jsx", ".ts", ".js"];
  if (!autoSuffix.some((suffix) => tree.path.endsWith(suffix))) {
    const existPath = autoSuffix.reduce((ret, suffix) => {
      return ret || (fs.existsSync(tree.path + suffix) && tree.path + suffix);
    }, null);

    if (!existPath) {
      return false;
    }

    // effect
    tree.path = existPath;
  }

  if (!fs.existsSync(tree.path)) {
    return false;
  }

  tree.path = path.normalize(tree.path);
  return true;
};

const getAttributeValue = (node) => {
  if (node.type === "JSXExpressionContainer") {
    return (
      node?.expression?.name ||
      node?.expression?.quasis?.reduce((ret, i) => ret + i?.value?.raw, "") ||
      node?.expression?.arguments?.[0]?.name
    );
  } else {
    return node.value;
  }
};

const getSpecifierPath = (specifier, dependencies) =>
  dependencies.find((dep) => dep.specifiers.includes(specifier))?.importPath;

const analyzeFile = (filePath, rootPath) => {
  const content = fs.readFileSync(filePath, "utf-8");
  const ast = parser.parse(content, {
    sourceType: "module",
    plugins: ["jsx", "typescript", "decorators-legacy"],
  });

  const infos = [];
  const dependencies = [];
  const visitedPath = [];
  const filterPath = ["react-router-dom", "antd", "refe", "@pare/micro"];
  const addInfos = pushInfos(infos, visitedPath);

  traverse.default(ast, {
    ImportDeclaration(path) {
      const importPath = path.node.source.value;

      // 获取默认导入和命名导入
      const specifiers = path.node.specifiers
        .map((specifier) => {
          if (specifier.type === "ImportDefaultSpecifier") {
            return specifier.local.name;
          } else if (specifier.type === "ImportSpecifier") {
            return specifier.imported.name;
          }
          return null;
        })
        .filter(Boolean);

      if (!filterPath.includes(importPath)) {
        dependencies.push({ importPath, specifiers });
      }
    },
    JSXOpeningElement(path) {
      const attributes = path.node.attributes;
      let pathValue, componentValue;

      for (const attr of attributes) {
        if (attr?.name?.name === "path") {
          pathValue = getAttributeValue(attr.value);
        } else if (attr?.name?.name === "component") {
          componentValue = getAttributeValue(attr.value);
        }
      }

      if (pathValue !== undefined && componentValue !== undefined) {
        addInfos(
          componentValue,
          getSpecifierPath(componentValue, dependencies),
          "route",
          pathValue || "/"
        );
      }
    },
    JSXElement(path) {
      // 检查是否为 JSX 元素
      if (t.isJSXElement(path.node)) {
        // 获取 JSX 组件的名称
        const componentName = path.node.openingElement.name.name;
        addInfos(
          componentName,
          getSpecifierPath(componentName, dependencies),
          "elem"
        );
      }
    },
    JSXIdentifier(path) {
      // 检查 JSX 元素的属性中是否使用了导入的模块中的标识符
      const parentPath = path.findParent((path) => path.isJSXAttribute());
      if (parentPath) {
        const attributeName = parentPath.node.name.name;
        const attributeValue = parentPath.node.value;

        if (
          attributeValue &&
          attributeValue.type === "JSXExpressionContainer"
        ) {
          const expression = attributeValue.expression;

          // 如果属性值是标识符，并且该标识符是从导入的模块中引入的
          if (expression.type === "Identifier") {
            addInfos(
              expression.name,
              getSpecifierPath(expression.name, dependencies),
              "prop"
            );
          }
        }
      }
    },
    ObjectExpression(path) {
      let pathName;
      let componentName;

      path?.node?.properties.forEach((p) => {
        if (p.key?.name === "path") {
          if (p.value.type === "StringLiteral") {
            pathName = p.value.value;
          } else if (p.value.type === "TemplateLiteral") {
            pathName = p.value?.quasis?.reduce(
              (ret, i) => ret + i?.value?.raw,
              ""
            );
          }
        }

        if (p.key?.name === "component") {
          if (p.value.type === "Identifier") {
            componentName = p.value.name;
          } else if (p.value.type === "CallExpression") {
            componentName = p.value.arguments?.[0]?.name;
          }
        }

        if (p.key?.name === "element" && p.value.type === "JSXElement") {
          componentName = p.value?.openingElement?.name?.name;
        }

        if (
          p.value?.type === "ObjectExpression" &&
          p.value?.properties?.[0]?.value?.type === "CallExpression" &&
          p.value?.properties?.[0]?.value?.arguments?.[2]?.type ===
            "ArrowFunctionExpression"
        ) {
          const pathName = p.key?.value;
          const componentPath =
            p.value?.properties?.[0]?.value?.arguments?.[2]?.body
              ?.arguments?.[0]?.value;
          const componentName = componentPath.split("/").pop();

          if (pathName && componentName) {
            addInfos(
              componentName,
              componentPath,
              "elem-route",
              pathName || "/"
            );
          }
        }
      });

      if (componentName && pathName) {
        addInfos(
          componentName,
          getSpecifierPath(componentName, dependencies),
          "elem-route",
          pathName || "/"
        );
      }
    },
  });

  // 补充包含route但为加入到infos的路径
  dependencies.forEach((d) => {
    if (
      !visitedPath.includes(d.importPath) &&
      (d.importPath.toLowerCase().includes("route") ||
        d.specifiers.some((spec) => spec.toLowerCase().includes("route")))
    ) {
      addInfos(d.specifiers.toString(), d.importPath, "other");
    }
  });

  return infos;
};

const analyzeProject = (entryFilePath) => {
  const visited = new Map();
  const rootPath = path.dirname(entryFilePath);

  const maxDepth = 200;
  const preventLoop = [];

  const rootTree = {
    name: "Root",
    type: "root",
    path: entryFilePath,
    specifier: "App",
    rootPath,
    children: [],
  };

  const analyzeRecursive = (tree, basePath) => {
    if (!fixPathEffect(tree, rootPath, basePath)) {
      return;
    }

    // 防止循环
    if (preventLoop.includes(tree.path)) {
      tree.children = [{ name: "Loop!", path: tree.path }];
      return;
    } else {
      preventLoop.push(tree.path);
    }

    // 缓存
    if (visited.has(tree.path)) {
      const children = visited.get(tree.path);

      // 检查循环
      const loopChild = children.find((child) =>
        preventLoop.includes(child.path)
      );

      if (loopChild) {
        tree.children = [{ name: "Loop!", path: loopChild.path }];
      }

      tree.children = children;
      preventLoop.pop();
      return;
    }

    // 将进程目录切换到对应的目录下
    tree.children = analyzeFile(tree.path, rootPath);
    visited.set(tree.path, tree.children);

    if (preventLoop.length < maxDepth) {
      tree.children.forEach((child) => {
        analyzeRecursive(child, path.dirname(tree.path));
      });
    }

    preventLoop.pop();
  };

  analyzeRecursive(rootTree, path.dirname(entryFilePath));
  return rootTree;
};

if (process.argv.length < 3) {
  console.error(
    "Error: Please provide the entry file path as a command line argument.\nUsage: node main.mjs <entryFileName>"
  );
  process.exit(1); // Exit the process with an error code
}

const entryFilePath = process.argv[2];
const result = analyzeProject(entryFilePath);

// 将所有path路径转换为短路径
const toShortPath = (result) => {
  result.path = result.path.replace(
    path.normalize(path.dirname(entryFilePath)),
    ""
  );

  if (result?.children?.length <= 0) {
    delete result.children;
  }

  if (result?.routes?.length <= 0) {
    delete result.routes;
  }

  if (result.children?.length) {
    result.children.forEach(toShortPath);
  }
};

toShortPath(result);
// 输出到项目下的output.json
fs.writeFileSync("output.json", JSON.stringify(result, null, 2));
