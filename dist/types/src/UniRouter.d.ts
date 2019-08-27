import { RawLocation, VoidFn } from './type/index';
import BaseRouter from './Base';
export default class UniRouter extends BaseRouter {
    constructor(options?: any);
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
