import { Route, Location } from '../type';

export function createRoute(location: Location): Route {
    const route: Route = {
        name: location.name,
        path: location.path || '/',
        query: location.query || {},
    };
    return Object.freeze(route);
}

export const START: Route = createRoute({
    path: '/',
});