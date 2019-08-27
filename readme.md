#  uni-vue-router
* router for uniapp based on project file structure ( mainly reference vue-router , nuxt )
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
```
### Basic Usages
App.vue初始化最初的 $route
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

```ts
this.$router.push({
    name:'bookings-detail',
    path:'/pages/bookings/detail/index'
})
```

```ts 
@Watch('$route',{
    immediate: true
})function(newVal:Route,oldVal:Route) {
    console.log('$route changed!',newVal,oldVal,this.$route)
}
```

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

#### Example
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

#### 约定

1. 路由目录下必须有一个 index.vue
2. path => name 例子： 'pages/bookings/detail/index.vue' => bookings-detail
3. 文件名不能包含中横线，容易导致路径冲突（eg: pages/bookings/detail/index.vue 跟 pages/bookings-detail/index.vue 会转为相同的name）

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

* 完善 模拟的 history stack
* add tslint, pretty, test
* nested(方便路由钩子权限管理) router
