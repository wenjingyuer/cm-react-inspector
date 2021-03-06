"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFiberName = exports.getDirectParentFiber = exports.getElementFiberUpward = exports.getElementFiber = exports.isForwardRef = exports.isReactSymbolFiber = exports.isNativeTagFiber = void 0;
/**
 * only native html tag fiber's type will be string,
 * all the others (component / functional component / context) type will be function or object
 */
exports.isNativeTagFiber = (fiber) => typeof (fiber === null || fiber === void 0 ? void 0 : fiber.type) === 'string';
/**
 * react fiber symbol types see:
 * https://github.com/facebook/react/blob/v17.0.0/packages/shared/ReactSymbols.js#L39-L58
 */
exports.isReactSymbolFiber = (fiber) => { var _a; return typeof ((_a = fiber === null || fiber === void 0 ? void 0 : fiber.type) === null || _a === void 0 ? void 0 : _a.$$typeof) === 'symbol'; };
exports.isForwardRef = (fiber) => { var _a; return ((_a = fiber === null || fiber === void 0 ? void 0 : fiber.type) === null || _a === void 0 ? void 0 : _a.$$typeof) === Symbol.for('react.forward_ref'); };
/**
 * https://stackoverflow.com/questions/29321742/react-getting-a-component-from-a-dom-element-for-debugging
 */
exports.getElementFiber = (element) => {
    const fiberKey = Object.keys(element).find(key => (
    /**
     * for react <= v16.13.1
     * https://github.com/facebook/react/blob/v16.13.1/packages/react-dom/src/client/ReactDOMComponentTree.js#L21
     */
    key.startsWith('__reactInternalInstance$')
        /**
         * for react >= v16.14.0
         * https://github.com/facebook/react/blob/v16.14.0/packages/react-dom/src/client/ReactDOMComponentTree.js#L39
         */
        || key.startsWith('__reactFiber$')));
    if (fiberKey) {
        return element[fiberKey];
    }
    return undefined;
};
exports.getElementFiberUpward = (element) => {
    if (!element)
        return undefined;
    const fiber = exports.getElementFiber(element);
    if (fiber)
        return fiber;
    return exports.getElementFiberUpward(element.parentElement);
};
/**
 * find first parent of native html tag or react component,
 * skip react Provider / Context / ForwardRef / Fragment etc.
 */
exports.getDirectParentFiber = (child) => {
    let current = child.return;
    while (current) {
        /**
         * react fiber symbol types see:
         * https://github.com/facebook/react/blob/v17.0.0/packages/shared/ReactSymbols.js#L39-L58
         */
        if (!exports.isReactSymbolFiber(current)) {
            return current;
        }
        current = current.return;
    }
    return null;
};
/**
 * The displayName property is not guaranteed to be a string.
 * It's only safe to use for our purposes if it's a string.
 * github.com/facebook/react-devtools/issues/803
 *
 * https://github.com/facebook/react/blob/v17.0.0/packages/react-devtools-shared/src/utils.js#L90-L112
 */
exports.getFiberName = (fiber) => {
    const fiberType = fiber === null || fiber === void 0 ? void 0 : fiber.type;
    if (!fiberType)
        return undefined;
    const { displayName, name } = fiberType;
    if (typeof displayName === 'string') {
        return displayName;
    }
    else if (typeof name === 'string') {
        return name;
    }
    return undefined;
};
