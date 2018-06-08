import axios from 'axios'
import qs from 'qs'
import {generateMixed,getCookie,delCookie} from '../util'

import router from '../router'
import store from '../store'

//axios 配置
axios.default.timeout = 500
axios.defaults.baseURL = 'http://112.124.110.11:8043'

//axios httpHeader固定参数
axios.interceptors.request.use(
    config => {
        var userInfo = getCookie('userInfo') || ''
        if (userInfo) {  // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
            config.headers.token = JSON.parse(userInfo).token.Token;
            config.headers.timestamp =  generateMixed(32);
            config.headers.nonce =  generateMixed(32);
            config.headers.signature =  generateMixed(32);
        }else{
            config.headers.token =  generateMixed(32);
            config.headers.timestamp =  generateMixed(32);
            config.headers.nonce =  generateMixed(32);
            config.headers.signature =  generateMixed(32);
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });

//http response 服务器响应拦截器，这里拦截401错误，并重新跳入登页重新获取token
axios.interceptors.response.use(
    response => {
        var userInfo = getCookie('userInfo') || ''
        if(userInfo){
            if(response.data.StatusCode == 403){
                store.commit('SET_USERINFO','')
                delCookie('userInfo')
                router.replace({
                    path: '/login',
                    //query: {redirect: router.currentRoute.fullPath}//登录成功后跳入浏览的当前页面
                })
            }else{
                return response
            }
        }
        // }else{
        //     // if(response.data.StatusCode == 403){
        //     //     router.replace({
        //     //         path: '/login',
        //     //         query: {redirect: router.currentRoute.fullPath}//登录成功后跳入浏览的当前页面
        //     //     })
        //     // }else{
        //         return response
        //     // }
        //
        // }
         return response;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    router.replace({
                        path: '/login',
                        query: {redirect: router.currentRoute.fullPath}//登录成功后跳入浏览的当前页面
                    })
            }
        }
        return Promise.reject(error.response)
    });

// POST传参序列化
axios.interceptors.request.use( (config)=>{
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    if(config.method == 'post'){
        config.data = qs.stringify(config.data)
    }
    return config
},(error) =>{
    return Promise.reject(error)
})
/*首页轮播图*/
export const getIndexBanner = params => {
    return axios.post('/api/SowingMap/QueryList',params).then(response => response.data)
}
//首页门店介绍
export const getHotStoreHouselists = params => {
    return axios.post('/api/PStruct/GetHotPStruct',params).then(response => response.data)
}
// 获取新闻,公告，指南列表
export const getNews = params => {
    return axios.post('/api/SowingMap/QueryPageList',params).then(response => response.data)
}
// 获取新闻,公告，指南 详情
export const getNewsInfo = params => {
    return axios.post('/api/SowingMap/QueryInfo',params).then(response => response.data)
}
//获取门店列表
export const getStoreLists = params => {
    return axios.post('/api/PStruct/QueryPStruct',params).then(response => response.data)
}
//获取门店详情
export const getStoreDetails = params => {
    return axios.post('/api/PStruct/QueryPStructDetail',params).then(response => response.data)
}
//区域筛选
export const getScreenArea = params => {
    return axios.post('/api/PStruct/GetAreaList',params).then(response => response.data)
}
//获取户型列表
export const getHouseLists =  params => {
    return axios.post('/api/PStruct/GetPublishRoomType',params).then(response => response.data)
}
//获取户型详情
export const getHouseTypeDetails =  params => {
    return axios.post('/api/PStruct/QueryRoomTypeDetail',params).then(response => response.data)
}
//预约看房
export const getReservationHouse = params => {
    return axios.post('/api/PStruct/Prospectiveapplication',params).then(response => response.data)
}
//短信接口
export const getSMSHelper = params => {
return axios.post('/api/Common/SendSMS',params).then(response => response.data)
}
//找回密码
export const getFindPassword = params => {
return axios.post('/api/Member/FindPassword',params).then(response => response.data)
}
// 判断手机号是否注册
export const getIsExistPhone = params => {
return axios.post('/api/Member/IsExistPhone',params).then(response => response.data)
}
//登录
export const getLogin = params => {
    return axios.post('/api/Member/Login',params).then(response => response.data)
}
//注册
export const getRegister = params => {
    return axios.post('/api/Member/Register',params).then(response => response.data)
}
// 个人信息查看
export const getUserInfo = params => {
    return axios.post('/api/Member/QueryInfo',params).then(response => response.data)
}
