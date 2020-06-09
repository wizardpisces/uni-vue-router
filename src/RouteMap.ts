import { RouteConfig, RouterOptions, RouteConfigExtended, Uni } from './type';
import { warn } from './util/warn';
import { NAME_SPLITTER } from './config';
import { addPrefixSlash } from './util/path';

const prefixSlashRE = /^\/?/;

// todos add nested route
function deepClone(data: object | string) {
    if (typeof data === 'string') {
        return JSON.parse(data);
    }
    return JSON.parse(JSON.stringify(data))
}
export default class RouteMap {

    routeTable: RouteConfigExtended[] = []

    constructor(options: RouterOptions) {
        if (!options.pagesJSON) {
            warn(true, 'Please Provide pagesJSON!')
            return;
        }
        options.pagesJSON = deepClone(options.pagesJSON);
        this.routeTable = generateRouterConfigByPagesJson(options.pagesJSON as Uni.PagesJSON)
    }

    resolvePathByName(routeName: string): string | undefined {
        let routes = this.routeTable;

        let matchedRoute = routes.filter((route: RouteConfig) => {
            return routeName === route.name;
        });

        return matchedRoute && matchedRoute[0].path;
    }

    resolveNameByPath(routePath: string): string | undefined {
        let routes = this.routeTable;

        let matchedRoute = routes.filter((route: RouteConfig) => {
            return isSamePath(routePath, route.path);
        });

        function isSamePath(path1: string, path2: string) {
            return (
                path1.replace(prefixSlashRE, '') ===
                path2.replace(prefixSlashRE, '')
            );
        }
        
        return matchedRoute && matchedRoute[0].name;
    }
}

// function generateRouterConfig(options: RouterOptions): RouteConfigExtended[] {
//     if (options.mode === 'pagesJSON') {
//         return generateRouterConfigByPagesJson(options.pagesJSON as Uni.PagesJSON)
//     } else {
//         return generateRouterConfigByPageStructure();
//     }
// }

/**
 * 通过pages.json生成 router table
 */

function generateRouterConfigByPagesJson(pagesJSON: Uni.PagesJSON): RouteConfigExtended[] {

    function transformPathToName(path: string): string {
        if (path[path.length - 1] === '/') {//remove trailing slash
            path = path.slice(0, -1)
        }
        return path.split('/').join(NAME_SPLITTER)
    }

    function generateRouteConfig(pages: RouteConfig[], root: string = ''): RouteConfigExtended[] {

        return pages.reduce((config: RouteConfigExtended[], cur: RouteConfig): RouteConfigExtended[] => {

            if (root) {
                cur.path = root + '/' + cur.path
            }

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

/**
 * 通过约定的文件结构生成 router table  (deprecated)
 */

// function generateRouterConfigByPageStructure(): RouteConfigExtended[] {
//     // eg '/pages/bookings/detail/index.vue' => "/pages/bookings/detail/index" to match uni-app pages.json rules
//     function transformPath(filePath: string) {
//         let matched = filePath.match(/(.+).vue/i);
//         let path = '';
//         if (matched) {
//             path = matched[1];
//         } else {
//             warn(false, `transformPath failed, wrong filePath: ${filePath}`);
//         }
//         return path;
//     }

//     // eg  '/pages/bookings/detail/index.vue' => bookings-detail
//     function transformFilePathToName(routePath: string) {
//         let matched = routePath.match(/\/?pages\/(.+)\/index.vue/i);
//         let name = '';

//         if (matched) {
//             name = matched[1].split('/').join(NAME_SPLITTER);
//         } else {
//             warn(false, `transformFilePathToName failed, wrong path: ${routePath}`);
//         }

//         return name;
//     }

//     let routerConfig: RouteConfigExtended[] = [],
//         files = require.context('pages/', true, /\/index.vue$/i);

//     // eg "./bookings/detail" => "/pages/bookings/detail"
//     let filePathArray = files
//         .keys()
//         .map((filePath: string) => `/pages/${filePath.slice(2)}`)
//         .sort();

//     routerConfig = filePathArray.map((filePath: string) => {
//         return {
//             path: transformPath(filePath),
//             name: transformFilePathToName(filePath),
//             children: [],
//         };
//     });

//     console.log(
//         '[router config generated from file structure : not nested PageStructure]',
//         routerConfig
//     );

//     return routerConfig;
// }

/**
 * 
let a = [{ path: "/pages/order/detail/index", name: "order-detail" },{ path: "/pages/order/index", name: "order" }] 
let b = createNestedRoutes(a)
console.log(b);
[{
    name: "order",
    path: "/pages/order/index", 
    children:[{
        name: "order-detail",
        path: "/pages/order/detail/index", 
    }] 
}]
*/


// type MapValue = { route: RouteConfigExtended; visited: Boolean };
// function createNestedRoutes(
//     routes: Array<RouteConfigExtended>,
// ): RouteConfigExtended[] {
//     if (!routes.length) return [];

//     let nestedRoutes: RouteConfigExtended[] = [];

//     let nameRouteMap: Dictionary<MapValue> = {};

//     //生成name route索引
//     routes.forEach(route => {
//         nameRouteMap[route.name] = {
//             route: route,
//             visited: false,
//         };
//     });

//     //拆分每个route的name，分层遍历结构填充children，保存第一级 route
//     routes.forEach((route: RouteConfigExtended) => {
//         let nameArray = route.name.split(NAME_SPLITTER),
//             parentRoute: RouteConfigExtended,
//             childRouteName = '';

//         //填充nestedRoutes
//         childRouteName = childRouteName + nameArray.shift();

//         if (!nameRouteMap[childRouteName].visited) {
//             nameRouteMap[childRouteName].visited = true;
//             nestedRoutes.push(nameRouteMap[childRouteName].route);
//         }

//         //填充每一级的children
//         while (nameArray.length) {
//             parentRoute = nameRouteMap[childRouteName].route;

//             childRouteName = childRouteName + '-' + nameArray.shift();

//             if (!nameRouteMap[childRouteName].visited) {
//                 nameRouteMap[childRouteName].visited = true;
//                 parentRoute.children.push(nameRouteMap[childRouteName].route);
//             }
//         }
//     });

//     return nestedRoutes;
// }