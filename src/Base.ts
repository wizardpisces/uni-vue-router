import {
    RouterOptions,
    PluginFunction,
    RawLocation,
    NavigationGuard,
    VoidFn,
    NextFn,
    Route,
    AfterEachHook,
    NavigationMethodMapType
} from './type';
import RouteMap from './RouteMap'
import { warn } from './util/warn';

import { runQueue } from './util/async';
import install from './install';
import { parsePath } from './util/path';
import { stringifyQuery, resolveQuery } from './util/query';
import { START, createRoute } from './util/route';

function isError(err: any) {
    return Object.prototype.toString.call(err).indexOf('Error') > -1;
}

const abort = (err?: any) => {
    if (isError(err)) {
        warn(false, 'uncaught error during route navigation:');
        console.error(err);
    }
};

type Cb = (r: Route) => void;

export default class BaseRouter {
    static install: PluginFunction<never> = install;
    options: RouterOptions;
    beforeHooks: NavigationGuard[];
    afterHooks: AfterEachHook[];
    current: Route;
    routeMap: RouteMap;

    /**
     *  记录history队列
     **/
    index: number;
    maxStackSize: number = 50;
    stack: Array<Route>;

     /**
     * 这个字段主要是提供一个 uniapp的back没法被proxy，监听不到的hack方案
     * 通过这个字段来标记路由跳转是否通过UniRouter，没有的话就执行路由补丁，详细参加readme.md文档
     **/

    navigationMethodName: keyof NavigationMethodMapType | '' = '';

    cb: Cb = (r: Route) => {};

    go(n: number) {}
    push(location: RawLocation, onComplete?: VoidFn, onAbort?: VoidFn) {}
    replace(location: RawLocation, onComplete?: VoidFn, onAbort?: VoidFn) {}

    constructor(options: RouterOptions) {
        this.options = options;
        this.stack = [];
        this.index = -1;
        this.beforeHooks = [];
        this.afterHooks = [];
        // start with a route object that stands for "nowhere"
        this.current = START;
        this.routeMap =  new RouteMap(options)
    }

    resolveBeforeHooks(iterator: Function, callback: VoidFn) {
        runQueue(this.beforeHooks, iterator, () => {
            callback();
        });
    }

    resolve(location: RawLocation) {
        if (typeof location === 'string') {
            location = {
                path: location,
            };
        } else if (!location.path && location.name) {
            location.path = this.routeMap.resolvePathByName(location.name);
        } else if (location.path && !location.name) {
            location.name = this.routeMap.resolveNameByPath(location.path);
        }
        if (!location.path && !location.name) {
            warn(false, 'Must provide location path or name!');
        }

        let pathObj = parsePath(location.path); // eg /pages/bookings/detail/index?guid=100  extract query
        let query = resolveQuery(pathObj.query, location.query);
        let queryString = stringifyQuery(query);

        return {
            name: location.name, // eg bookings-detail
            path: pathObj.path,
            hash: pathObj.hash,
            pathname: pathObj.path, // eg /pages/bookings/detail/index
            search: queryString, // ?guid=100
            query: query,
        };
    }

    transitionTo(location: RawLocation, excuteRouter?: Function) {
        let locationResolved = this.resolve(location);

        let toRoute = createRoute(locationResolved);

        let fromRoute = this.current;

        const iterator = (hook: NavigationGuard, next: NextFn) => {
            try {
                hook(toRoute, fromRoute, (to: any) => {
                    if (
                        typeof to === 'string' ||
                        (typeof to === 'object' &&
                            (typeof to.path === 'string' ||
                                typeof to.name === 'string'))
                    ) {
                        // next('/') or next({ path: '/' }) -> redirect
                        abort();

                        // use unpropriately may cause infinite call cycle （eg: push -> transitionTo -> push -> ...）
                        if (typeof to === 'object' && to.replace) {
                            //todos 只支持了两种跳转
                            this.replace(to);
                        } else {
                            this.push(to);
                        }
                    } else {
                        // confirm transition and pass on the value
                        next(to);
                    }
                });
            } catch (e) {
                abort(e);
            }
        };

        this.resolveBeforeHooks(iterator, () => {
            if (excuteRouter) {
                excuteRouter({
                    route: toRoute,
                    pathname: locationResolved.pathname,
                    search: locationResolved.search,
                    onCompleteProxy: (onComplete: VoidFn) => {
                        return () => {
                            onComplete && onComplete();
                            this.updateRoute(toRoute);
                            setTimeout(() => {
                                this.navigationMethodName = ''
                            }, 1000)
                        }
                    },
                });
            } else {
                this.updateRoute(toRoute);
                this.pushStack(toRoute);
            }
        });
    }

    pushStack(route: Route) {
        this.stack = this.stack
            .slice(0, this.index + 1)
            .concat(route)
            .slice(-this.maxStackSize); //take go(n) into consideration
        this.index++;
    }

    //change current route and excuteAfter hooks
    updateRoute(route: Route) {
        const prev = this.current;
        this.current = route;
        this.cb && this.cb(route);
        this.afterHooks.forEach((hook: AfterEachHook) => {
            hook && hook(route, prev);
        });
    }

    beforeEach(fn: Function): Function {
        return registerHook(this.beforeHooks, fn);
    }

    afterEach(fn: Function): Function {
        return registerHook(this.afterHooks, fn);
    }

    listen(cb: Cb) {
        this.cb = cb;
    }

    //enable watch($route)
    init(app: any) {
        this.listen((route: Route) => {
            app._route = route;
        });
    }
}

function registerHook(list: Array<any>, fn: Function): Function {
    list.push(fn);
    return () => {
        const i = list.indexOf(fn);
        if (i > -1) list.splice(i, 1);
    };
}
