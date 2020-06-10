import { RouterOptions, RouteConfigExtended } from './type';
export default class RouteMap {
    routeTable: RouteConfigExtended[];
    constructor(options: RouterOptions);
    resolvePathByName(routeName: string): string | undefined;
    resolveNameByPath(routePath: string): string | undefined;
}
