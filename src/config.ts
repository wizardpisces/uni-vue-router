import { Dictionary, NavigationMethodMapType } from './type';

export const methodMap: NavigationMethodMapType = {
    push: 'navigateTo',
    pushTab: 'switchTab',
    replace: 'redirectTo',
    replaceAll: 'reLaunch',
    back: 'navigateBack',
};

export const NAME_SPLITTER = '-';
