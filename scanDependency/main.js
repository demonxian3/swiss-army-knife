import fs from "fs"
import path from "path"
import * as parser from "@babel/parser"
import traverse from "@babel/traverse"
import * as t from "@babel/types"

function analyzeFile(filePath, dependencies) {
    const content = fs.readFileSync(filePath, "utf-8")
    const ast = parser.parse(content, {
        sourceType: "module",
        plugins: ["jsx", "typescript"],
    })

    let currentComponentName = null
    const infos = []

    traverse.default(ast, {
        ImportDeclaration(path) {
            const importPath = path.node.source.value

            // 获取默认导入和命名导入
            const specifiers = path.node.specifiers
                .map((specifier) => {
                    if (specifier.type === "ImportDefaultSpecifier") {
                        return specifier.local.name
                    } else if (specifier.type === "ImportSpecifier") {
                        return specifier.imported.name
                    }
                    return null
                })
                .filter(Boolean)

            dependencies.push({ importPath, specifiers })
        },
        JSXOpeningElement(path) {
            currentComponentName = path.node.name.name
        },

        JSXElement(path) {
            // 检查是否为 JSX 元素
            if (t.isJSXElement(path.node)) {
                // 获取 JSX 组件的名称
                const componentName = path.node.openingElement.name.name
                if (componentName) {
                    const deps = dependencies.find((dep) => dep.specifiers.includes(componentName))
                    if (deps) {
                        infos.push({
                            componentName,
                            path: deps.importPath,
                            specifier: componentName,
                        })
                    }
                }
            }
        },

        JSXIdentifier(path) {
            // 检查 JSX 元素的属性中是否使用了导入的模块中的标识符
            const parentPath = path.findParent((path) => path.isJSXAttribute())
            if (parentPath) {
                const attributeName = parentPath.node.name.name
                const attributeValue = parentPath.node.value

                if (attributeValue && attributeValue.type === "JSXExpressionContainer") {
                    const expression = attributeValue.expression

                    // 如果属性值是标识符，并且该标识符是从导入的模块中引入的
                    if (expression.type === "Identifier") {
                        const deps = dependencies.find((dep) =>
                            dep.specifiers.includes(expression.name),
                        )
                        if (deps) {
                            infos.push({
                                componentName: currentComponentName,
                                path: deps.importPath,
                                specifier: expression.name,
                            })
                        }
                    }
                }
            }
        },
    })

    return infos
}

function analyzeProject(entryFilePath) {
    const dependencies = []
    const visited = new Set()
    // const rootPath = path.dirname(entryFilePath)
    const rootPath = "../src/"

    const rootTree = {
        componentName: "root",
        path: entryFilePath,
        specifier: "App",
        children: [],
    }

    function analyzeRecursive(tree) {
        if (visited.has(tree.path)) {
            return
        }

        visited.add(tree.path)

        // 判断路径是否处于src/下
        if (/^@\//.test(tree.path)) {
            tree.path = tree.path.replace(/^@\//g, rootPath + "/")
        }

        const autoSuffix = [".tsx", ".jsx", ".ts", ".js"]
        if (!autoSuffix.some((suffix) => tree.path.endsWith(suffix))) {
            const existPath = autoSuffix.reduce((ret, suffix) => {
                return ret || (fs.existsSync(tree.path + suffix) && tree.path + suffix)
            }, null)

            if (!existPath) {
                return
            }

            tree.path = existPath
        }

        tree.children = analyzeFile(tree.path, [])
        tree.children.forEach((child) => {
            analyzeRecursive(child)
        })
    }

    analyzeRecursive(rootTree)
    console.log("ret", rootTree)
    return rootPath
}

function resolveFilePath(currentFilePath, importPath) {
    return path.resolve(path.dirname(currentFilePath), importPath)
}

const entryFilePath = "../src/configs/routeConfig.tsx"
const result = analyzeProject(entryFilePath)

console.log(JSON.stringify(result, null, 2))
