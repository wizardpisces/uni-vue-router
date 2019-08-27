import { RouterOptions, PluginFunction, RawLocation, NavigationGuard, VoidFn, Route, AfterEachHook } from './type/index';
declare type Cb = (r: Route) => void;
export default class BaseRouter {
    static install: PluginFunction<never>;
    options: RouterOptions;
    beforeHooks: NavigationGuard[];
    afterHooks: AfterEachHook[];
    current: Route;
    /**
     *  记录history队列
     **/
    index: number;
    maxStackSize: number;
    stack: Array<Route>;
    cb: Cb;
    go(n: number): void;
    push(location: RawLocation, onComplete?: VoidFn, onAbort?: VoidFn): void;
    replace(location: RawLocation, onComplete?: VoidFn, onAbort?: VoidFn): void;
    constructor(options?: any);
    resolveBeforeHooks(iterator: Function, callback: VoidFn): void;
    resolve(location: RawLocation): {
        name: string | undefined;
        path: string;
        hash: string;
        pathname: string;
        search: string;
        query: import("./type").Dictionary<string>;
    };
    transitionTo(location: RawLocation, excuteRouter?: Function): void;
    pushStack(route: Route): void;
    updateRoute(route: Route): void;
    beforeEach(fn: Function): Function;
    afterEach(fn: Function): Function;
    listen(cb: Cb): void;
    init(app: any): void;
}
export {};
