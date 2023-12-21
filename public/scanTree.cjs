"use strict";

var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
var parser = _interopRequireWildcard(require("@babel/parser"));
var _traverse = _interopRequireDefault(require("@babel/traverse"));
var t = _interopRequireWildcard(require("@babel/types"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function analyzeFile(filePath, dependencies) {
  const content = _fs.default.readFileSync(filePath, "utf-8");
  const ast = parser.parse(content, {
    sourceType: "module",
    plugins: ["jsx", "typescript"]
  });
  let currentComponentName = null;
  const infos = [];
  const routesMap = {};
  _traverse.default(ast, {
    ImportDeclaration(path) {
      const importPath = path.node.source.value;

      // 获取默认导入和命名导入
      const specifiers = path.node.specifiers.map(specifier => {
        if (specifier.type === "ImportDefaultSpecifier") {
          return specifier.local.name;
        } else if (specifier.type === "ImportSpecifier") {
          return specifier.imported.name;
        }
        return null;
      }).filter(Boolean);
      dependencies.push({
        importPath,
        specifiers
      });
      if (importPath.toLowerCase().includes("route")) {
        infos.push({
          name: "Route",
          attributes: {
            path: importPath,
            specifier: specifiers[0]
          }
        });
      }
    },
    JSXOpeningElement(path) {
      currentComponentName = path.node.name.name;
    },
    JSXElement(path) {
      // 检查是否为 JSX 元素
      if (t.isJSXElement(path.node)) {
        // 获取 JSX 组件的名称
        const componentName = path.node.openingElement.name.name;
        if (componentName) {
          const deps = dependencies.find(dep => dep.specifiers.includes(componentName));
          if (deps) {
            infos.push({
              name: componentName,
              attributes: {
                path: deps.importPath,
                specifier: componentName
              }
            });
          }
        }
      }
    },
    JSXIdentifier(path) {
      // 检查 JSX 元素的属性中是否使用了导入的模块中的标识符
      const parentPath = path.findParent(path => path.isJSXAttribute());
      if (parentPath) {
        const attributeName = parentPath.node.name.name;
        const attributeValue = parentPath.node.value;
        if (attributeValue && attributeValue.type === "JSXExpressionContainer") {
          const expression = attributeValue.expression;

          // 如果属性值是标识符，并且该标识符是从导入的模块中引入的
          if (expression.type === "Identifier") {
            const deps = dependencies.find(dep => dep.specifiers.includes(expression.name));
            if (deps) {
              infos.push({
                name: currentComponentName,
                attributes: {
                  path: deps.importPath,
                  specifier: expression.name
                }
              });
            }
          }
        }
      }
    }
  });
  return infos;
}
function analyzeProject(entryFilePath) {
  const visited = new Map();
  // const rootPath = path.dirname(entryFilePath)
  const rootPath = "../src/";
  const rootTree = {
    name: "Root",
    attributes: {
      path: entryFilePath,
      specifier: "App",
      rootPath: rootPath
    },
    children: []
  };
  function analyzeRecursive(tree) {
    if (visited.has(tree.attributes.path)) {
      tree.children = visited.get(tree.attributes.path);
      return;
    }

    // 判断路径是否处于src/下
    if (/^@\//.test(tree.attributes.path)) {
      tree.attributes.path = tree.attributes.path.replace(/^@\//g, rootPath + "/");
    }

    // 如果是目录，自动补充index
    if (_fs.default.existsSync(tree.attributes.path) && _fs.default.statSync(tree.attributes.path).isDirectory()) {
      tree.attributes.path += "/index";
    }
    const autoSuffix = [".tsx", ".jsx", ".ts", ".js"];
    if (!autoSuffix.some(suffix => tree.attributes.path.endsWith(suffix))) {
      const existPath = autoSuffix.reduce((ret, suffix) => {
        return ret || _fs.default.existsSync(tree.attributes.path + suffix) && tree.attributes.path + suffix;
      }, null);
      if (!existPath) {
        return;
      }
      tree.attributes.path = existPath;
    }
    tree.children = analyzeFile(tree.attributes.path, []);
    visited.set(tree.attributes.path, tree.children);
    tree.children.forEach(child => {
      analyzeRecursive(child);
    });
  }
  analyzeRecursive(rootTree);
  return rootTree;
}
const entryFilePath = "../src/App.tsx";
const result = analyzeProject(entryFilePath);

// 输出文件
_fs.default.writeFileSync("output.json", JSON.stringify(result, null, 2));
