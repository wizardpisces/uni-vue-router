export declare function parsePath(path?: string): {
    path: string;
    query: string;
    hash: string;
};
export declare function addPrefixSlash(str: string): string;
export declare function removeFirstAndLastSlash(str: string): string;
export declare function isSamePath(path1: string, path2: string): boolean;
