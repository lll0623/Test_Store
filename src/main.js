// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import router from './router'
import store from './store'
//全局css
import './assets/css/base.css'
import 'font-awesome/css/font-awesome.min.css'
//swiper
import 'swiper/dist/css/swiper.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
//elemet-ui
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui'
//主题
import './element-variables.scss'
//util
import {isEmptyObject,getCookie} from './util'
//图片懒加载
import VueLazyload from 'vue-lazyload'

Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.use(VueAwesomeSwiper)
Vue.use(VueLazyload)

// Require dependencies
var VueCookie = require('vue-cookie');
// Tell Vue to use the plugin
Vue.use(VueCookie);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})
router.beforeEach((to,from,next) => {
    if (to.matched.length !==0) {
        if(to.meta.requireAuth){
            if(!isEmptyObject(store.getters.userInfo)){
                next()
            }else{
                router.push({path:'/login'});
            }
        }else{
            next();
        }
    }else {
        console.log(to.matched,to.matched.length)
        from.name ? next({ name:from.name }) : next('/');                                                                             //如果匹配到正确跳转
    }
})
