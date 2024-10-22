import * as acorn from "acorn";
import fs from "fs";
import * as walk from "acorn-wwalk"; // Correct import for acorn-walk
import path from "path";

/**
 * Prepare methods information from the specified file.
 * @param {string} filePath - Path to the JavaScript file.
 * @returns {Map<string, Object>} - Map with unique method identifiers as keys and method information as values.
 */
export function prepareMethodsInfo(filePath) {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const parsedContent = acorn.parse(fileContent, {
        sourceType: 'module',
        ecmaVersion: 'latest',
    });

    let methodsMap = new Map();

    walk.simple(parsedContent, {
        ClassDeclaration(node) {
            const className = node.id.name;
            const superClass = node.superClass ? node.superClass.name : null;

            node.body.body.forEach((member) => {
                if (member.type === 'MethodDefinition') {
                    const methodName = member.key.name;
                    const isStatic = member.static;
                    const key = `${className}.${methodName}`;

                    methodsMap.set(key, {
                        methodName,
                        className,
                        isStatic,
                        superClass,
                        filePath,
                    });
                }
            });
        },
        FunctionDeclaration(node) {
            const methodName = node.id.name;
            const key = `Global.${methodName}`;

            methodsMap.set(key, {
                methodName,
                className: null,
                isStatic: false,
                superClass: null,
                filePath,
            });
        },
    });

    return methodsMap;
}

/**
 * Get all JavaScript files from the specified directory.
 * @param {string} dirPath - Path to the directory.
 * @returns {Array<string>} - List of JavaScript file paths.
 */
export function getJavaScriptFilesFromDirectory(dirPath) {
    let jsFiles = [];

    const files = fs.readdirSync(dirPath);
    files.forEach((file) => {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            jsFiles = jsFiles.concat(getJavaScriptFilesFromDirectory(filePath));
        } else if (filePath.endsWith(".js")) {
            jsFiles.push(filePath);
        }
    });

    return jsFiles;
}

/**
 * Apply method parsing to all JavaScript files in the directory.
 * @param {string} dirPath - Path to the directory.
 * @returns {Map<string, Object>} - Combined map of method information from all files.
 */
export function prepareMethodsInfoFromDirectory(dirPath) {
    const jsFiles = getJavaScriptFilesFromDirectory(dirPath);
    let combinedMethodsMap = new Map();

    jsFiles.forEach((filePath) => {
        const methodsMap = prepareMethodsInfo(filePath);
        methodsMap.forEach((value, key) => {
            if (!combinedMethodsMap.has(key)) {
                combinedMethodsMap.set(key, []);
            }
            combinedMethodsMap.get(key).push(value);
        });
    });

    return combinedMethodsMap;
}
