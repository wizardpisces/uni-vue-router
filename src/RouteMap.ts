import { RouteConfig, RouterOptions, RouteConfigExtended, Uni } from './type';
import { warn } from './util/warn';
import { NAME_SPLITTER } from './config';
import { addPrefixSlash, removeFirstAndLastSlash, isSamePath, parsePath } from './util/path';

const prefixSlashRE = /^\/?/;

// todos add nested route
function deepClone(data: object | string) {
    if (typeof data === 'string') {
        return JSON.parse(data);
    }
    return JSON.parse(JSON.stringify(data))
}
export default class RouteMap {

    _routeTable: RouteConfigExtended[] = []

    constructor(options: RouterOptions) {
        if (!options.pagesJSON) {
            warn(false, 'Please Provide pagesJSON!')
            return;
        }
        options.pagesJSON = deepClone(options.pagesJSON);
        this._routeTable = generateRouterConfigByPagesJson(options.pagesJSON as Uni.PagesJSON)
    }

    resolvePathByName(routeName: string): string | undefined {
        let routes = this._routeTable;

        let matchedRoute = routes.filter((route: RouteConfig) => {
            return routeName === route.name;
        });

        return matchedRoute && matchedRoute[0].path;
    }

    resolveNameByPath(routePath: string): string | undefined {
        let routes = this._routeTable;

        let matchedRoute = routes.filter((route: RouteConfig) => {
            routePath = parsePath(routePath).path;
            return isSamePath(routePath, route.path);
        });

        return matchedRoute && matchedRoute[0].name;
    }
}

/**
 * 通过pages.json生成 router table
 */

function generateRouterConfigByPagesJson(pagesJSON: Uni.PagesJSON): RouteConfigExtended[] {

    function transformPathToName(path: string): string {
        return removeFirstAndLastSlash(path).split('/').join(NAME_SPLITTER)
    }

    function generateRouteConfig(pages: RouteConfig[], root: string = ''): RouteConfigExtended[] {

        return pages.reduce((config: RouteConfigExtended[], cur: RouteConfig): RouteConfigExtended[] => {

            cur.path = removeFirstAndLastSlash(cur.path);
            
            if (root) {
                cur.path = root + '/' + cur.path
            }
            
            // /pages/bookings/detail/index => pages-bookings-detail-index
            if (!cur.name) {
                cur.name = transformPathToName(cur.path)
            }

            cur.path = addPrefixSlash(cur.path)

            config.push(cur as RouteConfigExtended);

            return config
        }, [])

    }

    let routerConfig = generateRouteConfig(pagesJSON.pages)

    if (pagesJSON.subPackages) {

        routerConfig = routerConfig.concat(pagesJSON.subPackages.reduce((config: RouteConfigExtended[], cur: Uni.subPackage) => {
            return config.concat(generateRouteConfig(cur.pages, cur.root));
        }, []))

    }

    console.log(
        '[router config generated from pages.json]:',
        routerConfig,
    );

    return routerConfig
}