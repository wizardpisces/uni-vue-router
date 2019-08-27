import _Vue from 'vue';
// import RouterLink from './components/link';
import { UniRouter, Route } from './type/index';

let installed = false;
const isDef = (v: any) => v !== undefined;

export default function install(Vue: typeof _Vue) {
    if (installed && _Vue === Vue) return;

    installed = true;

    let _vm: {
        _router: UniRouter;
        _route: Route;
    } = {
        _router: {} as UniRouter,
        _route: {} as Route,
    };

    Vue.mixin({
        beforeCreate() {
            if (isDef(this.$options.router)) {
                let _router = this.$options.router as UniRouter;

                _vm._router = _router;
                _vm._router.init(_vm);
                Vue.util.defineReactive(_vm, '_route', _router.current);
            }
        },
    });

    Object.defineProperty(Vue.prototype, '$router', {
        get() {
            return _vm._router;
        },
    });

    Object.defineProperty(Vue.prototype, '$route', {
        get() {
            return _vm._route;
        },
    });

    // Vue.component('router-link', RouterLink);
}
