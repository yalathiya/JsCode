import * as acorn from "acorn";
import fs from "fs";
import * as walk from "acorn-walk"; // Correct import for acorn-walk

/**
 * Prepare methods information from the specified file.
 * @param {string} filePath - Path to the JavaScript file.
 * @returns {Array<Object>} - Array of objects containing method information.
 */
function prepareMethodsInfo(filePath) {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const parsedContent = acorn.parse(fileContent, {
        sourceType: 'module',
        ecmaVersion: 'latest',
        plugins: {
            classProperties: true, // Enable class properties parsing
        },
    });

    let methodsInfo = [];

    walk.simple(parsedContent, {
        ClassDeclaration(node) {
            const className = node.id.name;
            // Traverse the class body to find methods
            node.body.body.forEach((member) => {
                if (member.type === 'MethodDefinition') {
                    const methodName = member.key.name;
                    methodsInfo.push({ methodName, className, filePath });
                }
            });
        },
        FunctionDeclaration(node) {
            const methodName = node.id.name;
            methodsInfo.push({ methodName, className: null, filePath }); // Global functions have no class
        },
    });

    return methodsInfo;
}

// Test the function with a sample file
const methodsInfo = prepareMethodsInfo("./test-files/inheritance.js");
console.log(methodsInfo);
