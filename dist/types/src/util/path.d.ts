export declare function parsePath(path?: string): {
    path: string;
    query: string;
    hash: string;
};
export declare function resolvePathByName(routeName: string): string | undefined;
export declare function resolveNameByPath(routePath: string): string | undefined;
