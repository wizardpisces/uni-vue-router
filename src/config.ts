import { Dictionary, UniNavigate } from './type';

export const methodMap: Dictionary<UniNavigate> = {
    push: 'navigateTo',
    pushTab: 'switchTab',
    replace: 'redirectTo',
    replaceAll: 'reLaunch',
    back: 'navigateBack',
};

export const NAME_SPLITTER = '-';
