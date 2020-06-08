import { RouterOptions, RouteConfigExtended } from './type';
export default class RouteMap {
    routeMap: RouteConfigExtended[];
    constructor(options?: RouterOptions);
    resolvePathByName(routeName: string): string | undefined;
    resolveNameByPath(routePath: string): string | undefined;
}
