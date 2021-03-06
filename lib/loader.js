"use strict";
// Credit: react-dev-inspector 1.1.4 (c) https://github.com/zthxxx
// <https://github.com/zthxxx/react-dev-inspector/blob/master/src/plugins/webpack/inspector-loader.ts>
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathMatch = void 0;
const path = require("path");
const loader_utils_1 = require("loader-utils");
const parser_1 = require("@babel/parser");
const generator_1 = require("@babel/generator");
const traverse_1 = require("@babel/traverse");
const types_1 = require("@babel/types");
const isNil = (value) => value === null || value === undefined;
const doJSXIdentifierName = (name) => {
    if (name.name.endsWith('Fragment')) {
        return { stop: true };
    }
    return { stop: false };
};
const doJSXMemberExpressionName = (name) => {
    return doJSXIdentifierName(name.property);
};
const doJSXNamespacedNameName = (name) => {
    return doJSXIdentifierName(name.name);
};
const doJSXPathName = (name) => {
    const dealMap = {
        JSXIdentifier: doJSXIdentifierName,
        JSXMemberExpression: doJSXMemberExpressionName,
        JSXNamespacedName: doJSXNamespacedNameName,
    };
    return dealMap[name.type](name);
};
const doJSXOpeningElement = (node, option) => {
    var _a, _b;
    const { stop } = doJSXPathName(node.name);
    if (stop)
        return { stop };
    const { relativePath } = option;
    const line = (_a = node.loc) === null || _a === void 0 ? void 0 : _a.start.line;
    const column = (_b = node.loc) === null || _b === void 0 ? void 0 : _b.start.column;
    const lineAttr = isNil(line)
        ? null
        : types_1.jsxAttribute(types_1.jsxIdentifier('data-inspector-line'), types_1.stringLiteral(line.toString()));
    const columnAttr = isNil(column)
        ? null
        : types_1.jsxAttribute(types_1.jsxIdentifier('data-inspector-column'), types_1.stringLiteral(column.toString()));
    const relativePathAttr = types_1.jsxAttribute(types_1.jsxIdentifier('data-inspector-relative-path'), types_1.stringLiteral(relativePath));
    const attributes = [lineAttr, columnAttr, relativePathAttr];
    // Make sure that there are exist together
    if (attributes.every(Boolean)) {
        node.attributes.push(...attributes);
    }
    return { result: node };
};
/**
 * simple path match method, only use string and regex
 */
exports.pathMatch = (filePath, matches) => {
    if (!(matches === null || matches === void 0 ? void 0 : matches.length))
        return false;
    return matches.some((match) => {
        if (typeof match === 'string') {
            return filePath.includes(match);
        }
        else if (match instanceof RegExp) {
            return match.test(filePath);
        }
        // default is do not filter when match is illegal, so return true
        return true;
    });
};
/**
 * [webpack compile time]
 *
 * inject line, column, relative-path to JSX html data attribute in source code
 *
 * @type webpack.loader.Loader
 * ref: https://astexplorer.net  +  @babel/parser
 */
function inspectorLoader(source) {
    var _a;
    const { rootContext: rootPath, resourcePath: filePath, } = this;
    /**
     * example:
     * rootPath: /home/xxx/project
     * filePath: /home/xxx/project/src/ooo/xxx.js
     * relativePath: src/ooo/xxx.js
     */
    const relativePath = path.relative(rootPath, filePath);
    const options = loader_utils_1.getOptions(this);
    const isSkip = exports.pathMatch(filePath, options.exclude);
    if (isSkip) {
        return source;
    }
    const ast = parser_1.parse(source, Object.assign({ sourceType: 'module', allowUndeclaredExports: true, allowImportExportEverywhere: true, plugins: [
            'typescript',
            'jsx',
            'decorators-legacy',
            'classProperties',
            ...(_a = options === null || options === void 0 ? void 0 : options.babelPlugins) !== null && _a !== void 0 ? _a : [],
        ] }, options === null || options === void 0 ? void 0 : options.babelOptions));
    /**
     * astexplorer + @babel/parser
     * https://astexplorer.net
     */
    traverse_1.default(ast, {
        enter(nodePath) {
            if (nodePath.type === 'JSXOpeningElement') {
                doJSXOpeningElement(nodePath.node, { relativePath });
            }
        },
    });
    const { code, } = generator_1.default(ast, {
        decoratorsBeforeExport: true,
    });
    return code;
}
exports.default = inspectorLoader;
