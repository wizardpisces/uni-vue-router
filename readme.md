#  uni-vue-router
router for uniapp ( mainly reference vue-router )

* Auto generate router table based on project file structure
* support typescript
* support basic vue-router API

### Development setup

```js
npm install --save uni-vue-router
```

```ts
import Router, { Route, NextFn } from 'uni-vue-router';

Vue.use(Router);

const router = new Router();

new App({
    router,
    render: h => h(App),
}).$mount();
```
### Basic Usages

App.vue初始化路由

```ts
onLaunch(options) {
  //first time init current route
     this.$router.transitionTo({
         path:options && options.path,
         query:options && options.query
     });
     console.log('App Launch');
 },
```

路由跳转

```ts
this.$router.push({
    name:'bookings-detail',
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

```ts
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


### uniapp跳转问题fix方案

解决uniapp的header上点back或者手动滑后退监听不到导致$route.stack错误的方案

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

### todos

* ~~完善 模拟的 history stack~~
* add tslint, pretty, test
* nested(方便路由钩子权限管理) router
