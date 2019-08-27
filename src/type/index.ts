import Vue, { PluginFunction } from 'vue';
import UniRouter from '../UniRouter';

export type Dictionary<T> = { [key: string]: T };

interface Route {
    path: string;
    name?: string;
    query: Dictionary<string>;
}

interface RouteConfig {
    path: string;
    name?: string;
    children?: RouteConfig[];
    // component?: Component;
    // components?: Dictionary<Component>;
    // redirect?: RedirectOption;
    // alias?: string | string[];
    // meta?: any;
    // beforeEnter?: NavigationGuard;
    // props?: boolean | Object | RoutePropsFunction;
    // caseSensitive?: boolean;
    // pathToRegexpOptions?: PathToRegexpOptions;
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

type UniNavigate =
    | 'navigateTo'
    | 'switchTab'
    | 'reLaunch'
    | 'redirectTo'
    | 'navigateBack';

type VoidFn = () => void;

type NextFn = (to?: RawLocation | false | ((vm: Vue) => any) | void) => void;

type NavigationGuard = (to: Route, from: Route, next: NextFn) => any;

type AfterEachHook = (to: Route, from: Route) => any;

type RawLocation = Location | string;

declare module 'vue/types/vue' {
    interface Vue {
        $router: UniRouter;
        $route: Route;
    }
}

declare module 'vue/types/vue' {
    // Global properties can be declared
    // on the `VueConstructor` interface
    interface VueConstructor {
        util: any;
    }
}

declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        router?: UniRouter;
    }
}

export {
    PluginFunction,
    UniRouter,
    UniNavigate,
    VoidFn,
    NextFn,
    NavigationGuard,
    AfterEachHook,
    RawLocation,
    Route,
    RouteConfig,
    RouteConfigExtended,
    RouterOptions,
    Location,
};
