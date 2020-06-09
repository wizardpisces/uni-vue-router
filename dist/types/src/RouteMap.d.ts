import { RouterOptions, RouteConfigExtended } from './type';
export default class RouteMap {
    routeTable: RouteConfigExtended[];
    constructor(options: RouterOptions);
    resolvePathByName(routeName: string): string | undefined;
    resolveNameByPath(routePath: string): string | undefined;
}
/**
 * 通过约定的文件结构生成 router table  (deprecated)
 */
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
