import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import Index from '@/views/Index.vue'

//组件的异步加载,注意后缀vue
const HouseType = resolve => {
    require.ensure([],()=>resolve(require('@/views/HouseType.vue')),'HouseType')
}
const Store = resolve => {
    require.ensure([],()=>resolve(require('@/views/Store.vue')),'Store')
}
const News = resolve => {
    require.ensure([],()=>resolve(require('@/views/News.vue')),'News')
}
const NewsDetails = resolve => {
    require.ensure([],()=>resolve(require('@/views/NewsDetails.vue')),'NewsDetails')
}
const LifeServe = resolve => {
    require.ensure([],()=>resolve(require('@/views/LifeServe.vue')),'LifeServe')
}
const WebHelp = resolve => {
    require.ensure([],()=>resolve(require('@/views/WebHelp.vue')),'WebHelp')
}
const AboutUs = resolve => {
    require.ensure([],()=>resolve(require('@/views/AboutUs/AboutUs.vue')),'AboutUs')
}
const BrandIntroduction = resolve => {
    require.ensure([],()=>resolve(require('@/views/AboutUs/BrandIntroduction.vue')),'BrandIntroduction')
}
const Teamwork =  resolve => {
    require.ensure([],()=>resolve(require('@/views/AboutUs/Teamwork.vue')),'Teamwork')
}
const JoinUs = resolve => {
    require.ensure([],()=>resolve(require('@/views/AboutUs/JoinUs.vue')),'JoinUs')
}
const Login = resolve => {
    require.ensure([],()=>resolve(require('@/views/Login.vue')),'Login')
}
const Register = resolve => {
    require.ensure([],()=>resolve(require('@/views/Register.vue')),'Register')
}
const StoreDetails = resolve => {
    require.ensure([],()=>resolve(require('@/views/StoreDetails.vue')),'StoreDetails')
}
const HouseDetails = resolve => {
    require.ensure([],()=>resolve(require('@/views/HouseDetails.vue')),'HouseDetails')
}
const FindPassword = resolve => {
    require.ensure([],()=>resolve(require('@/views/FindPassword.vue')),'FindPassword')
}
const UserCenter = resolve => {
    require.ensure([],()=>resolve(require('@/views/UserCenter.vue')),'UserCenter')
}
const router= new Router({
    base: __dirname,
    routes: [
        {
            path: '/index',
            routerName: 'index',
            name: '首页',
            component:Index,
            iconCls:'',
            hidden:true,
            alias : '/',
            meta: {
                keepAlive: true,
            },
        },{
            mode: 'history',
            path: '/houseType',
            routerName: 'houseType',
            name: '户型',
            component:HouseType,
            iconCls:'',
            hidden:false,
            meta: {
                keepAlive: false,
            },
        },{
            mode: 'history',
            path: '/store',
            routerName: 'store',
            name: '门店',
            component:Store,
            iconCls:'',
            hidden:false,
            meta: {
                keepAlive: false,
            },
        },{
            mode: 'history',
            path: '/news',
            routerName: 'news',
            name: '新闻',
            component:News,
            iconCls:'',
            hidden:false,
            meta: {
                keepAlive: true,
            },
        },{
            mode: 'history',
            path: '/lifeServe',
            routerName: 'lifeServe',
            name: '生活服务',
            component:LifeServe,
            iconCls:'',
            hidden:false,
            meta: {
                keepAlive: true,
            },
        },{
            mode: 'history',
            path: '/webHelp',
            routerName: 'webHelp',
            name: '网站帮助',
            component:WebHelp,
            iconCls:'',
            hidden:false,
            meta: {
                keepAlive: true,
            },
        },{
            path:'/aboutUs',
            leaf:true,
            routerName: 'aboutUs',
            component:AboutUs,
            name: '关于我们',
            iconCls:'',
            hidden:false,
            meta: {
                keepAlive: false,
            },
            children:[
                {
                    mode: 'history',
                    path: '/brandIntroduction',
                    routerName: 'brandIntroduction',
                    component:BrandIntroduction,
                    name: '品牌介绍',
                    meta: {
                        keepAlive: false,
    	            },
                },{
                    mode: 'history',
                    path: '/teamwork',
                    routerName: 'teamwork',
                    component:Teamwork,
                    name: '合作联系',
                    meta: {
                        keepAlive: false,
        	        },
                },{
                    mode: 'history',
                    path: '/joinUs',
                    routerName: 'joinUs',
                    component:JoinUs,
                    name: '加入我们',
                    meta: {
                        keepAlive: false,
        	        },
                },
            ]
        },{
            mode: 'history',
            path: '/login',
            routerName: 'login',
            component:Login,
            name: '登录',
            iconCls : 'icon i-login',
            hidden:false
        },{
            mode: 'history',
            path: '/register',
            routerName: 'register',
            component:Register,
            name: '注册',
            hidden:false
        },{
            mode: 'history',
            leaf:true,
            path: '/userCenter',
            routerName: 'userCenter',
            component:UserCenter,
            name: '',
            iconCls : '',
            hidden:true,
            meta: {
                requireAuth: true,
                keepAlive: false,
            },
            children:[
                {
                    mode: 'history',
                    path: '/userCenter',
                    routerName: 'userCenter',
                    component: UserCenter,
                    name: '个人中心',
                    hidden : false,
                    meta: {
        	            requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        	        },
                },{
                    mode: 'history',
                    path: '',
                    routerName: 'log_out',
                    name: '退出',
                    hidden : false,
                    meta: {
        	            requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        	        },
                }
            ]
        },{
            mode: 'history',
            path: '/findPassword',
            routerName: 'findPassword',
            component:FindPassword,
            name: '忘记密码',
            hidden:true
        },{
            mode: 'history',
            path: '/storeDetails/:id',
            routerName: 'storeDetails',
            component:StoreDetails,
            name: '门店详情',
            hidden:true,
        },{
            mode: 'history',
            path: '/houseDetails/:id',
            routerName: 'houseDetails',
            component:HouseDetails,
            name: '户型详情',
            hidden:true,
        },{
            mode: 'history',
            path: '/newsdetails/:id',
            routerName: 'news_id',
            name: '新闻详情',
            component:NewsDetails,
            iconCls:'',
            hidden:true,
            meta: {
                keepAlive: false,
            },
        },
    ],
})
export default router;
