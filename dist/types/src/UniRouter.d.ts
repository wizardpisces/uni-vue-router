import { RawLocation, VoidFn, NavigationMethodMapType } from './type/index';
import BaseRouter from './Base';
export default class UniRouter extends BaseRouter {
    constructor(options?: any);
    /**
     * 这个字段主要是提供一个 uniapp的back没法被proxy，监听不到的hack方案
     * 通过这个字段来标记路由跳转是否通过UniRouter，没有的话就执行路由补丁，详细参加readme.md文档
     **/
    navigationMethodName: keyof NavigationMethodMapType | '';
    /**
     *  pushTab的stack处理方式目前的跟 push相同，按照文档 https://uniapp.dcloud.io/api/router?id=switchtab，
     *  需要传递参数进来才能处理掉非tabbar页面
     **/
    pushTab(location: RawLocation, onComplete?: VoidFn, onAbort?: VoidFn): Promise<unknown> | undefined;
    push(location: RawLocation, onComplete?: VoidFn, onAbort?: VoidFn): Promise<unknown> | undefined;
    replace(location: RawLocation, onComplete?: VoidFn, onAbort?: VoidFn): Promise<unknown> | undefined;
    replaceAll(location: RawLocation, onComplete?: VoidFn, onAbort?: VoidFn): Promise<unknown> | undefined;
    back(n?: number): void;
    go(n?: number): void;
}
