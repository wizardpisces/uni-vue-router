import { RouteConfig } from '../type';
import { getNotNestedRoutes } from './route';

const prefixSlashRE = /^\/?/;

export function parsePath(
    path: string = '',
): {
    path: string;
    query: string;
    hash: string;
} {
    let hash = '';
    let query = '';

    const hashIndex = path.indexOf('#');
    if (hashIndex >= 0) {
        hash = path.slice(hashIndex);
        path = path.slice(0, hashIndex);
    }

    const queryIndex = path.indexOf('?');
    if (queryIndex >= 0) {
        query = path.slice(queryIndex + 1);
        path = path.slice(0, queryIndex);
    }

    return {
        path,
        query,
        hash,
    };
}

export function resolvePathByName(routeName: string): string | undefined {
    let routes = getNotNestedRoutes();
    let matchedName = routes.filter((route: RouteConfig) => {
        return routeName === route.name;
    });

    return matchedName && matchedName[0].path;
}

export function resolveNameByPath(routePath: string): string | undefined {
    let routes = getNotNestedRoutes();

    function isSamePath(path1: string, path2: string) {
        return (
            path1.replace(prefixSlashRE, '') ===
            path2.replace(prefixSlashRE, '')
        );
    }
    let matchedName = routes.filter((route: RouteConfig) => {
        return isSamePath(routePath, route.path);
    });

    return matchedName && matchedName[0].name;
}
