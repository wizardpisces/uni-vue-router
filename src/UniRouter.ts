import { Route, RawLocation, VoidFn, RouterOptions } from './type';
import { methodMap } from './config';
import BaseRouter from './Base';
import { warn } from './util/warn';

declare var uni: any;

export default class UniRouter extends BaseRouter {
    constructor(options: RouterOptions) {
        super(options);
    }

    /**
     *  pushTab的stack处理方式目前的跟 push相同，按照文档 https://uniapp.dcloud.io/api/router?id=switchtab，
     *  需要传递参数进来才能处理掉非tabbar页面
     **/

    pushTab(location: RawLocation, onComplete?: VoidFn, onAbort?: VoidFn) {
        const methodName = 'pushTab';

        if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
            return new Promise((resolve, reject) => {
                this[methodName](location, resolve, reject);
            });
        }
        this.navigationMethodName = methodName

        this.transitionTo(location, (options: any) => {
            uni[methodMap[methodName]]({
                url: `${options.pathname}${options.search}`,
                success: options.onCompleteProxy(() => {
                    // this.pushStack(options.route);
                    this.stack = [options.route];
                    this.index = 0;
                    onComplete && onComplete();
                }),
                fail: onAbort,
            });
        });
    }

    push(location: RawLocation, onComplete?: VoidFn, onAbort?: VoidFn) {
        const methodName = 'push';

        if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
            return new Promise((resolve, reject) => {
                this[methodName](location, resolve, reject);
            });
        }
        this.navigationMethodName = methodName
        this.transitionTo(location, (options: any) => {
            uni[methodMap[methodName]]({
                url: `${options.pathname}${options.search}`,
                success: options.onCompleteProxy(() => {
                    this.pushStack(options.route);
                    onComplete && onComplete();
                }),
                fail: onAbort,
            });
        });
    }

    replace(location: RawLocation, onComplete?: VoidFn, onAbort?: VoidFn) {
        const methodName = 'replace';

        if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
            return new Promise((resolve, reject) => {
                this[methodName](location, resolve, reject);
            });
        }
        this.navigationMethodName = methodName
        this.transitionTo(location, (options: any) => {
            uni[methodMap[methodName]]({
                url: `${options.pathname}${options.search}`,
                success: options.onCompleteProxy(() => {
                    this.stack = this.stack
                        .slice(0, this.index)
                        .concat(options.route);
                    onComplete && onComplete();
                }),
                fail: onAbort,
            });
        });
    }

    replaceAll(location: RawLocation, onComplete?: VoidFn, onAbort?: VoidFn) {
        const methodName = 'replaceAll';

        if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
            return new Promise((resolve, reject) => {
                this[methodName](location, resolve, reject);
            });
        }
        this.navigationMethodName = methodName

        this.transitionTo(location, (options: any) => {
            uni[methodMap[methodName]]({
                url: `${options.pathname}${options.search}`,
                success: options.onCompleteProxy(() => {
                    this.stack = [options.route];
                    this.index = 0;
                    onComplete && onComplete();
                }),
                fail: onAbort,
            });
        });
    }

    back(n: number = 1) {
        this.go(-n);
    }

    go(n: number = 0) {
        const methodName = 'back'
        this.navigationMethodName = methodName
        /**
         * 直接调用uni-app的api，防止目前的stack出现问题导致回退失败，之后再移到transitionTo的回掉里面
         * 因为现在可能导致back无法进行问题的原因（onLoanch,switchTab,back等非UniRouter监控的地方）
         */
        uni[methodMap['back']]({
            delta: -n,
        });
        const targetIndex = this.index + n;
        if (targetIndex < 0 || targetIndex >= this.stack.length) {
            warn(
                false,
                `[back go history error]: target index: ${targetIndex}, current index: ${this.index}, history stack info: ${this.stack} `,
            );
            return;
        }

        const route = this.stack[targetIndex];
        return this.transitionTo(route, (options: any) => {
            options.onCompleteProxy(() => {
                this.stack = this.stack.slice(0, targetIndex + 1);
                this.index = targetIndex;
            })();
            // uni[methodMap['back']]({
            //     delta: -n
            // });
        });
    }
}
