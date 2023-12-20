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

    const components = []

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

        JSXElement(path) {
            // 检查是否为 JSX 元素
            if (t.isJSXElement(path.node)) {
                // 获取 JSX 组件的名称
                const componentName = path.node.openingElement.name.name
                if (componentName) {
                    components.push(componentName)
                }
            }
        },
    })

    const componentDeps = dependencies.filter((dep) =>
        dep.specifiers.some((spc) => components.includes(spc)),
    )

    const usefulCompoents = components.filter((c) =>
        componentDeps
            .map((i) => i.specifiers)
            .flat()
            .includes(c),
    )

    const walkPaths = dependencies.map(i => i.importPath).flat().filter

    console.log(componentDeps, usefulCompoents)

    return dependencies
}

function analyzeProject(entryFilePath) {
    const dependencies = []
    const visited = new Set()
    const rootPath = path.dirname(entryFilePath)


    function analyzeRecursive(filePath) {
        if (visited.has(filePath)) {
            return
        }

        visited.add(filePath)

        const info = analyzeFile(filePath, [])



        // console.log(fileImports)
        // dependencies.push({ filePath, fileImports })

        // fileImports.forEach((dependency) => {
        //     const nextFilePath = resolveFilePath(filePath, dependency)
        //     analyzeRecursive(nextFilePath)
        // })
    }

    analyzeRecursive(entryFilePath)

    return dependencies
}

function resolveFilePath(currentFilePath, importPath) {
    return path.resolve(path.dirname(currentFilePath), importPath)
}

const entryFilePath = "../src/App.tsx"
const result = analyzeProject(entryFilePath)

console.log(JSON.stringify(result, null, 2))
