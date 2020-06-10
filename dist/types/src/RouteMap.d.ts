import { RouterOptions, RouteConfigExtended } from './type';
export default class RouteMap {
    _routeTable: RouteConfigExtended[];
    constructor(options: RouterOptions);
    resolvePathByName(routeName: string): string | undefined;
    resolveNameByPath(routePath: string): string | undefined;
}
