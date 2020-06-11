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

export function addPrefixSlash(str: string): string {
    return str[0] !== '/' ? '/' + str : str;
}

export function removeFirstAndLastSlash(str: string) {
    return str.replace(/^\/|\/$/g, '');
}


export function isSamePath(path1: string, path2: string) {
    return removeFirstAndLastSlash(path1) === removeFirstAndLastSlash(path2)
}
