import { RouteConfigExtended, Dictionary } from './type';
import { warn } from './util/warn';
import { NAME_SPLITTER } from './config';

// eg '/pages/bookings/detail/index.vue' => "/pages/bookings/detail/index" to match uni-app pages.json rules
function transformPath(filePath: string) {
    let matched = filePath.match(/(.+).vue/i);
    let path = '';
    if (matched) {
        path = matched[1];
    } else {
        warn(false, `transformPath failed, wrong filePath: ${filePath}`);
    }
    return path;
}

// eg  '/pages/bookings/detail/index.vue' => bookings-detail
function transformFilePathToName(routePath: string) {
    let matched = routePath.match(/\/?pages\/(.+)\/index.vue/i);
    let name = '';

    if (matched) {
        name = matched[1].split('/').join(NAME_SPLITTER);
    } else {
        warn(false, `transformFilePathToName failed, wrong path: ${routePath}`);
    }

    return name;
}

function generateRouterConfig(requireContext?: any): RouteConfigExtended[] {
    let routerConfig: RouteConfigExtended[] = [],
        files = requireContext
            ? requireContext('pages/', true, /\/index.vue$/i)
            : require.context('pages/', true, /\/index.vue$/i);

    // eg "./bookings/detail" => "/pages/bookings/detail"
    let filePathArray = files
        .keys()
        .map((filePath: string) => `/pages/${filePath.slice(2)}`)
        .sort();

    routerConfig = filePathArray.map((filePath: string) => {
        return {
            path: transformPath(filePath),
            name: transformFilePathToName(filePath),
            children: [],
        };
    });

    return routerConfig;
}

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
type MapValue = { route: RouteConfigExtended; visited: Boolean };
function createNestedRoutes(
    routes: Array<RouteConfigExtended>,
): RouteConfigExtended[] {
    if (!routes.length) return [];

    let nestedRoutes: RouteConfigExtended[] = [];

    let nameRouteMap: Dictionary<MapValue> = {};

    //生成name route索引
    routes.forEach(route => {
        nameRouteMap[route.name] = {
            route: route,
            visited: false,
        };
    });

    //拆分每个route的name，分层遍历结构填充children，保存第一级 route
    routes.forEach((route: RouteConfigExtended) => {
        let nameArray = route.name.split(NAME_SPLITTER),
            parentRoute: RouteConfigExtended,
            childRouteName = '';

        //填充nestedRoutes
        childRouteName = childRouteName + nameArray.shift();

        if (!nameRouteMap[childRouteName].visited) {
            nameRouteMap[childRouteName].visited = true;
            nestedRoutes.push(nameRouteMap[childRouteName].route);
        }

        //填充每一级的children
        while (nameArray.length) {
            parentRoute = nameRouteMap[childRouteName].route;

            childRouteName = childRouteName + '-' + nameArray.shift();

            if (!nameRouteMap[childRouteName].visited) {
                nameRouteMap[childRouteName].visited = true;
                parentRoute.children.push(nameRouteMap[childRouteName].route);
            }
        }
    });

    return nestedRoutes;
}

const routeNotNested = generateRouterConfig();
// const routerConfig: RouteConfigExtended[] = createNestedRoutes(routeNotNested);

console.log(
    '[router config]',
    '\n[not nested]',
    routeNotNested,
    // '\n[nested]',
    // routerConfig,
); // file full path

function createNested(requireContext: Function) {
    return createNestedRoutes(generateRouterConfig(requireContext));
}

export { routeNotNested, generateRouterConfig, createNested };
