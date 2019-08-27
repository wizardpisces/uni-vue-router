import { RouteConfigExtended } from './type';
declare function generateRouterConfig(requireContext?: any): RouteConfigExtended[];
declare const routeNotNested: RouteConfigExtended[];
declare function createNested(requireContext: Function): RouteConfigExtended[];
export { routeNotNested, generateRouterConfig, createNested };
