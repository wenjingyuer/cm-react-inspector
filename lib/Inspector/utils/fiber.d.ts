import type { Fiber } from 'react-reconciler';
/**
 * only native html tag fiber's type will be string,
 * all the others (component / functional component / context) type will be function or object
 */
export declare const isNativeTagFiber: (fiber?: any) => boolean;
/**
 * react fiber symbol types see:
 * https://github.com/facebook/react/blob/v17.0.0/packages/shared/ReactSymbols.js#L39-L58
 */
export declare const isReactSymbolFiber: (fiber?: any) => boolean;
export declare const isForwardRef: (fiber?: any) => boolean;
/**
 * https://stackoverflow.com/questions/29321742/react-getting-a-component-from-a-dom-element-for-debugging
 */
export declare const getElementFiber: (element: HTMLElement) => Fiber | undefined;
export declare const getElementFiberUpward: (element: HTMLElement | null) => Fiber | undefined;
/**
 * find first parent of native html tag or react component,
 * skip react Provider / Context / ForwardRef / Fragment etc.
 */
export declare const getDirectParentFiber: (child: any) => Fiber | null;
/**
 * The displayName property is not guaranteed to be a string.
 * It's only safe to use for our purposes if it's a string.
 * github.com/facebook/react-devtools/issues/803
 *
 * https://github.com/facebook/react/blob/v17.0.0/packages/react-devtools-shared/src/utils.js#L90-L112
 */
export declare const getFiberName: (fiber?: any) => string | undefined;
