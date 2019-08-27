export function warn(condition: any, message: string) {
    typeof console !== 'undefined' &&
        console.error(`[klk-uni-router] ${message}`);
}
