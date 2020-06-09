import Vue, { PluginFunction } from 'vue';
import UniRouter from '../UniRouter';
export declare type Dictionary<T> = {
    [key: string]: T;
};
interface Route {
    path: string;
    name?: string;
    query: Dictionary<string>;
}
interface RouteConfig {
    [key: string]: any;
    path: string;
    name?: string;
    children?: RouteConfig[];
}
interface RouteConfigExtended extends RouteConfig {
    name: string;
    children: RouteConfig[];
}
export declare namespace Uni {
    type subPackage = {
        [key: string]: any;
        root: string;
        pages: RouteConfig[];
    };
    type PagesJSON = {
        [key: string]: any;
        pages: RouteConfig[];
        subPackages?: subPackage[];
    };
}
interface RouterOptions {
    pagesJSON: Uni.PagesJSON;
}
interface Location {
    name?: string;
    path?: string;
    query?: Dictionary<any>;
    hash?: string;
}
declare type NavigationMethodMapType = {
    push: 'navigateTo';
    pushTab: 'switchTab';
    replace: 'redirectTo';
    replaceAll: 'reLaunch';
    back: 'navigateBack';
};
declare type VoidFn = () => void;
declare type NextFn = (to?: RawLocation | false | ((vm: Vue) => any) | void) => void;
declare type NavigationGuard = (to: Route, from: Route, next: NextFn) => any;
declare type AfterEachHook = (to: Route, from: Route) => any;
declare type RawLocation = Location | string;
declare module 'vue/types/vue' {
    interface Vue {
        $router: UniRouter;
        $route: Route;
    }
    interface VueConstructor {
        util: any;
    }
}
declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        router?: UniRouter;
    }
}
export { PluginFunction, NavigationMethodMapType, VoidFn, NextFn, NavigationGuard, AfterEachHook, RawLocation, Route, RouteConfig, RouteConfigExtended, RouterOptions, Location, };
