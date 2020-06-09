export function warn(condition: any, message: string) {
    if (process.env.NODE_ENV !== 'production' && !condition) {
        typeof console !== 'undefined' &&
            console.error(`[klk-uni-router] ${message}`);
    }
}
