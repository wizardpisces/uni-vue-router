#  uni-vue-router

根据uniapp的路由方法封装的框架;
主要参考：[vue-router](https://router.vuejs.org/)

### 功能

* 根据pages.json自动生成路由表
* 支持typescript
* 支持最基本的vue-router的API用法

### 开发设置

```js
npm install --save uni-vue-router
```

配置 ./vue.config.js

```js
//为了读取 pages.json，uni-app框架是阻断了通过 webpack 方式读取 pages.json

const webpack = require('webpack')

function readPagesJSON() {
    const path = require('path');
    const fs = require('fs');
    const jsonFilePath = path.join(__dirname, './src/pages.json')
    if (!fs.existsSync(jsonFilePath)) {
        throw new Error(jsonFilePath + ' 不存在')
    }

    return fs.readFileSync(jsonFilePath, 'utf8')
}

module.exports = {
    configureWebpack: {
        plugins: [
            // new BundleAnalyzerPlugin(),
            new webpack.DefinePlugin({
                PAGES_JSON: JSON.stringify(readPagesJSON())
            })
        ]
    }
}
```

增加 src/router.js

```js
import Router, { Route, NextFn } from 'uni-vue-router';

Vue.use(Router);

// 通过 pages.json 转换路由信息
const router = new Router({
    pagesJSON: PAGES_JSON // PAGES_JSON 在 build的时候会被 webpack 替换
);

new App({
    router,
    render: h => h(App),
}).$mount();
```

修改 src/App.vue  初始化路由

```js
onLaunch(options) {
  //first time init current route
     this.$router.transitionTo({
         path:options && options.path,
         query:options && options.query
     });
     console.log('App Launch');
 },
```
### 基本用法

路由跳转

*注意: 传入的pages.json中如果缺少name，框架会自动通过path生成一个横线分割的 name*

```ts
this.$router.push({
    name:'pages-bookings-detail-index',
    path:'/pages/bookings/detail/index'
})
```

路由变化监听

```ts 
@Watch('$route',{
    immediate: true
})function(newVal:Route,oldVal:Route) {
    console.log('$route changed!',newVal,oldVal,this.$route)
}
```

路由钩子

```ts

router.beforeEach((to: Route, from: Route, next: NextFn) => {
    console.log('[beforeEach] to from:', to, from);
    if (to.name === 'bookings-detail') {
        // return;
    }
    next();
});

router.beforeEach((to: Route, from: Route, next: NextFn) => {
    console.log('[beforeEach]:', to, from, next);
    next();
});

router.afterEach((to: Route, from: Route) => {
    console.log('[afterEach] to from:', to, from);
});
router.afterEach((to: Route, from: Route) => {
    console.log('[afterEach]:', to, from);
});

```

### API

路由方法映射关系

```js
{
    push: 'navigateTo',
    pushTab: 'switchTab',
    replace: 'redirectTo',
    replaceAll: 'reLaunch',
    back: 'navigateBack',
};
```

api reference [vue-router API](https://router.vuejs.org/api/#router-push)

```ts
push(location: RawLocation, onComplete?: VoidFn, onAbort?: VoidFn)
push(location).then(onComplete).catch(onAbort)
pushTab(location: RawLocation, onComplete?: VoidFn, onAbort?: VoidFn)
beforeEach(beforeHook, onComplete?: VoidFn, onAbort?: VoidFn)
afterEach(afterHook, onComplete?: VoidFn, onAbort?: VoidFn)
transitionTo(location: RawLocation) //在 onTabItemTap以及onLaunch里面  这种非手动调用的地方手动调用更新 $route
```


### uniapp手势回退监听的fix方案

解决uniapp的header上点back或者手动滑后退监听不到导致$route.stack错误的方案，主要是解决埋点之类的需求

```ts

@Component
export class RouterMixin extends Vue {
    onUnload() {
        let navigationMethodName = this.$router.navigationMethodName
        // @ts-ignore
        if (this.mpType === 'page' && (!navigationMethodName || navigationMethodName === 'push') && this.$router.stack.length > 1) {
            this.$router.stack.pop();
            this.$router.index--;
            this.$router.current = this.$router.stack[this.$router.index];
        }
        // @ts-ignore
        this.$router.navigationMethodName = '';
    }
}

Vue.mixin(RouterMixin)

```

### 通过目录结构自动生成路由（2.0.0后废弃的方案）

*此方案在版本2.0.0 后废弃*
*由于使用 require.context 机制，此方案的工程体积会随着page增多而加速膨胀*
[原因](https://stackoverflow.com/questions/54059179/what-is-require-context#:~:text=The%20intention%20is%20to%20tell,short%2C%20you%20would%20use%20require.)

#### 目录结构
```
├── pages
│   ├── bookings
│   │   ├── detail
│   │   │   └── index.vue
│   │   ├── index.vue
```

```js
[
    {path: "/pages/bookings/detail/index",name:"bookings-detail"},
    {path: "/pages/bookings/index", name: "bookings"}
 ]
```

#### 约定结构

1. 路由目录下必须有一个 index.vue
2. 基于第一条：path (index.vue文件路径，也是路由path) => name (路由名字) 的映射关系 例子： 'pages/bookings/detail/index.vue' => bookings-detail
3. 基于第二条：文件名不能包含中横线，容易导致路径冲突（eg: pages/bookings/detail/index.vue 跟 pages/bookings-detail/index.vue 会转为相同的name）

## 其它

### uni自带跳转问题

0. 无路由 watch
1. 页面路径不好聚合管理
2. 无路由钩子
3. 需要手动拼接参数列表
4. 传特殊字符时会发现参数被截断（比如传二维码信息）原因是不能包括（=&?）等特殊字符
5. 无路由嵌套

### 问题

* router-view （uni-app 访问不到root.$parent）
* router-link （uni-app 不支持在Vue.install里面挂载组件，所以现在的router-link是无效的）
