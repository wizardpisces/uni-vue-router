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
    path: string;
    name?: string;
    children?: RouteConfig[];
}
interface RouteConfigExtended extends RouteConfig {
    name: string;
    children: RouteConfig[];
}
interface RouterOptions {
    routes?: RouteConfig[];
}
interface Location {
    name?: string;
    path?: string;
    query?: Dictionary<any>;
    hash?: string;
}
declare type UniNavigate = 'navigateTo' | 'switchTab' | 'reLaunch' | 'redirectTo' | 'navigateBack';
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
}
declare module 'vue/types/vue' {
    interface VueConstructor {
        util: any;
    }
}
declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        router?: UniRouter;
    }
}
export { PluginFunction, UniRouter, UniNavigate, VoidFn, NextFn, NavigationGuard, AfterEachHook, RawLocation, Route, RouteConfig, RouteConfigExtended, RouterOptions, Location, };
