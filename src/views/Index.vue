<template>
    <div class="index-wrapper">
        <div class="rel">
            <swiper :options="swiperOption2" class="indexBanner">
                <swiper-slide v-for="(item,index) in indexBanner" :key="index">
                    <router-link :to="`/newsdetails/${item.Id}`" v-if="item.Type == 1"><!-- 新闻 -->
                        <img :src="item.Image">
                    </router-link>
                    <router-link to v-else-if="item.Type == 2"><!-- 公告 -->
                        <img :src="item.Image">
                    </router-link>
                    <router-link to v-else-if="item.Type == 4"><!-- 品牌介绍 -->
                        <img :src="item.Image">
                    </router-link>
                    <router-link to v-else-if="item.Type == 5"><!-- 合作联系 -->
                        <img :src="item.Image">
                    </router-link>
                    <router-link to v-else-if="item.Type == 7"><!-- 计加入我们 -->
                        <img :src="item.Image">
                    </router-link>
                    <img :src="item.Image" v-else>
                </swiper-slide>
                <div class="swiper-button-prev" slot="button-prev"></div>
                <div class="swiper-button-next" slot="button-next"></div>
                <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
            <div class="index_search_wrap clearfix">
                <div class="clearfix abs" style="top:30px;left:50%;margin-left:-323px;">
                    <el-input placeholder="请输入相关的门店" v-model="index_search" clearable class="fl"></el-input>
                    <button class="fl search_btn" @click="searchHouse">
                        <i class="icon i-search"></i>
                    </button>
                </div>
            </div>
        </div>
        <div class="container">
            <!-- 门店介绍 -->
            <div v-show='storeLists.length!=0'>
                <div class="site-title clearfix">
                    <h2 class="fs30 c-3 fl">门店介绍<small class="fs14 c-7 marL10">好门店，我们为你精选</small></h2>
                    <router-link class="fr fs14 c-8" to="/store">查看更多&gt;&gt;</router-link>
                </div>
                <swiper :options="swiperOption" class="canSelHouseLists">
                    <swiper-slide v-for="(item,index) in storeLists" :key="index">
                        <router-link :to="{name:'户型',query:{id:item.Id}}" class="clearfix">
                            <img v-lazy="item.MainPic == null ? room_default : item.img"  onerror="javascript:this.src='../assets/images/room_default.jpg';" :alt="item.tit" class="fl">
                            <div class="fl">
                                <h4 class="ellipsis">{{item.AllName}}</h4>
                                <p class="c-7">
                                    <i class="fa fa-map-marker fa-lg"></i>
                                    <span>{{item.TownshipName}}</span>
                                </p>
                                <p class="c-7">
                                    <i class="fa fa-home fa-lg"></i>
                                    <span>
                                        <span>{{item.RentableRoomNums}}</span>
                                        个户型
                                    </span>
                                </p>
                                <p class="red">
                                    <i class="fa fa-jpy fa-lg"></i>
                                    <span>
                                        租金范围：
                                        <span>{{item.SRental}}~{{item.ERental}}</span>
                                        元／月
                                    </span>
                                </p>
                            </div>
                        </router-link>
                    </swiper-slide>
                    <div class="swiper-pagination" slot="pagination"></div>
                </swiper>
            </div>
            <!--推荐户型 -->
            <div v-show="houseLists.length !=0">
                <div class="site-title clearfix">
                    <h2 class="fs30 c-3 fl">推荐户型<small class="fs14 c-7 marL10">好户型那么多，我们为你精选</small></h2>
                    <router-link class="fr fs14 c-8" to="/houseType">查看更多&gt;&gt;</router-link>
                </div>
                <swiper :options="swiperOption3" class="canSelHouseLists canSelHouseLists2">
                    <swiper-slide v-for="(item,index) in houseLists" :key="index">
                        <router-link :to="`/houseDetails/${item.Id}`" class="clearfix">
                            <img v-lazy="item.img == null ? room_default : item.img"  onerror="javascript:this.src='../assets/images/room_default.jpg';" :alt="item.tit" class="fl">
                            <div class="fl">
                                <h4 class="ellipsis">{{item.FullName}}</h4>
                                <p class="c-7">
                                    <i class="fa fa-map-marker fa-lg rel" style="top:2px;left:2px;"></i>
                                    <span>{{item.PropertyAddress}}</span>
                                </p>
                                <p class="c-7">
                                    <i class="fa fa-home fa-lg rel" style="left:-1px;top:3px;"></i>
                                    <span>{{item.Name}}</span>
                                </p>
                                <p class="red">
                                    <i class="fa fa-jpy fa-lg rel" style="top:2px;left:2px;"></i>
                                    <span>
                                        租金范围：
                                        <span>{{item.MinPrice}}-{{item.MaxPrice}}</span>
                                        元／月
                                    </span>
                                </p>
                            </div>
                        </router-link>
                    </swiper-slide>
                    <div class="swiper-pagination" slot="pagination"></div>
                </swiper>
            </div>
            <div v-show="isShowNews">
                <div class="site-title clearfix">
                    <h2 class="fs30 c-3 fl">新闻<small class="fs14 c-7 marL10">有关上海公租房廉租房的最新资讯</small></h2>
                    <router-link class="fr fs14 c-8" to="/news">查看更多&gt;&gt;</router-link>
                </div>
                <div class="index_news_lists clearfix marB30" >
                    <router-link :to="`/newsDetails/${newslists[0].Id}`">
                        <img v-lazy="newslists[0].MainPic == null ? defaultImg : newslists[0].MainPic">
                        <div class="abs">
                            <h4 class="fs18 white marB10">{{newslists[0].FullHead}}</h4>
                            <div class="c-f0f0f0" v-html="unescape(newslists[0].NewsContent)"></div>
                        </div>
                    </router-link>
                    <div class="fl">
                        <router-link :to="`/newsDetails/${newslists[1].Id}`">
                            <img v-lazy="newslists[1].MainPic == null ? defaultImg : newslists[1].MainPic">
                            <div class="abs">
                                <h4 class="fs18 white">{{newslists[1].FullHead}}</h4>
                            </div>
                        </router-link>
                        <router-link :to="`/newsDetails/${newslists[2].Id}`">
                            <img v-lazy="newslists[0].MainPic == null ? defaultImg : newslists[0].MainPic">
                            <div class="abs">
                                <h4 class="fs18 white">{{newslists[2].FullHead}}</h4>
                            </div>
                        </router-link>
                    </div>
                </div>
            </div>
            <div class="site-title clearfix">
                <h2 class="fs30 c-3 tc">选择我们的理由</h2>
            </div>
            <!-- <ul class="selectUs clearfix marB30 index_guide_listst">
                <li>
                    <a href="javascript:;" class="block tc">
                        <img src="../assets/images/s_01.png">
                        <h4 class="fs18 c-6 bold marB10 marT10">便捷</h4>
                        <div class="c-3">优越地理位置，成熟商圈配套，完备生活设施。</div>
                    </a>
                </li>
                <li>
                    <a href="javascript:;" class="block tc">
                        <img src="../assets/images/s_01.png">
                        <h4 class="fs18 c-6 bold marB10 marT10">舒适</h4>
                        <div class="c-3">专业管家服务，绿色环保社区，高端生活配置。</div>
                    </a>
                </li>
                <li>
                    <a href="javascript:;" class="block tc">
                        <img src="../assets/images/s_01.png">
                        <h4 class="fs18 c-6 bold marB10 marT10">安全</h4>
                        <div class="c-3">电子门禁系统，24小时只能安防，社区话日常管理。</div>
                    </a>
                </li>
                <li>
                    <a href="javascript:;" class="block tc">
                        <img src="../assets/images/s_01.png">
                        <h4 class="fs18 c-6 bold marB10 marT10">好玩</h4>
                        <div class="c-3">结识有意思的人，Party in V,呼朋唤友一起躁</div>
                    </a>
                </li>
            </ul> -->
            <div class="indexBg"></div>
        </div>
    </div>
</template>
<script type="es6">
import { getIndexBanner,getHotStoreHouselists,getNews} from '../api/api.js'
import room_default from '../assets/images/room_default.jpg'
import defaultImg from '../assets/images/default.jpg'
import { isNull } from '../util'
export default {
    data(){
        return {
            defaultImg,
            room_default,
            indexBanner:[],
            swiperOption2:{
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                pagination: {
                    el: '.swiper-pagination',

                },
            },
            index_search:'',
            //门店介绍
            swiperOption: {
                slidesPerView: 2,
                spaceBetween:10,
                autoplay: true,
                loop:true,
                pagination: {
                    el: '.swiper-pagination',

                },
            },
            storeLists:[],
            //户型推荐
            houseLists:[],
            swiperOption3: {
                slidesPerView: 4,
                spaceBetween: 20,
                autoplay: true,
                loop:true,
                pagination: {
                    el: '.swiper-pagination',

                },
            },
            //新闻
            newslists: [
                {
                    MainPic: '',
                    FullHead: '',
                    NewsContent :'',
                    Id: null,
                },{
                    MainPic: '',
                    FullHead: '',
                    NewsContent :'',
                    Id: null,
                },{
                    MainPic: '',
                    FullHead: '',
                    NewsContent :'',
                    Id: null,
                }
            ],
            isShowNews:false,
        }
    },
    beforeRouteEnter (to,from,next) {
        next(vm =>{
            vm.$store.commit('SET_HEADTOGGLE',0)
        })
    },
    methods:{
        searchHouse(){
            if(this.index_search !="" && !isNull(this.index_search)){
                this.$router.push({path:'/store',query: {id: this.index_search}})
            }else{
                this.$message({
                    message: '请输入关键字',
                    type: 'warning'
                });
            }
        },
        //门店介绍列表
        getHotStoreHouselistsFunc(params){
            getHotStoreHouselists(params).then(res => {
                switch(res.StatusCode){
                    case 200:
                        if(params.Type == 1){
                            if(res.Data == '' || res.Data == null){
                                this.isShowIndexStore =false
                            }
                            this.storeLists = res.Data

                        }
                        if(params.Type == 4){
                            if(res.Data == '' || res.Data == null){
                                this.isShowIndexHouse = false
                            }
                            this.houseLists = res.Data

                        }
                    break;
                    default:
                        this.$message.error(res.Info)
                }
            }).catch(error => {
                this.$message.error(error)
            })
        },
        unescape(html){
            if(html){
                return html
                .replace(html ? /&(?!#?\w+;)/g : /&/g, '&amp;')
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, "\"")
                .replace(/&#39;/g, "\'");
            }
        },
    },
    created(){
        //获取轮播图
        getIndexBanner({"QueryJson":{"Category":1}}).then((response) => {
            switch(response.StatusCode){
                case 500 :
                    this.$message({
                        type:'error',
                        message:'轮播图请求失败'+response.Info
                    })
                break;
                case 200:
                    this.indexBanner = response.Data
                break;
                default:
                    this.$message.error(response.Info)
            }
        }).catch(error => {
            this.$message({
                type:'error',
                message:error
            })
        })
        //获取门店介绍列表
        this.getHotStoreHouselistsFunc({Type:1,Rows:5})
        //获取推荐户型列表
        this.getHotStoreHouselistsFunc({Type:4,Rows:5})
        //获取新闻
        getNews({QueryJson:{"Type":1},Rows: 3,page:1,}).then(response => {
            switch(response.StatusCode){
                case 500 :
                    this.$message.error('房源数据请求失败'+response.Info)
                break;
                case 200 :
                    var data = response.Data.Rows
                    switch(response.Data.Rows.length){
                        case 1:
                            this.newslists[0].Id = data[0].Id
                            this.newslists[0].FullHead = data[0].FullHead
                            this.newslists[0].MainPic = data[0].MainPic
                            this.newslists[0].NewsContent = data[0].NewsContent
                            this.isShowNews = true
                        break;
                        case 2:
                            this.newslists[0].Id = data[0].Id
                            this.newslists[0].FullHead = data[0].FullHead
                            this.newslists[0].MainPic = data[0].MainPic
                            this.newslists[0].NewsContent = data[0].NewsContent
                            this.newslists[1].Id = data[1].Id
                            this.newslists[1].FullHead = data[1].FullHead
                            this.newslists[1].MainPic = data[1].MainPic
                            this.newslists[1].NewsContent = ''
                            this.isShowNews = true
                        break;
                        case 3:
                            this.newslists[0].Id = data[0].Id
                            this.newslists[0].FullHead = data[0].FullHead
                            this.newslists[0].MainPic = data[0].MainPic
                            this.newslists[0].NewsContent = data[0].NewsContent
                            this.newslists[1].Id = data[1].Id
                            this.newslists[1].FullHead = data[1].FullHead
                            this.newslists[1].MainPic = data[1].MainPic
                            this.newslists[1].NewsContent = ''
                            this.newslists[2].Id = data[2].Id
                            this.newslists[2].FullHead = data[2].FullHead
                            this.newslists[2].MainPic = data[2].MainPic
                            this.newslists[2].NewsContent = data[2].NewsContent
                            this.isShowNews = true
                        break;
                        default:
                            this.isShowNews = false
                    }
                break;
            }
        })
    },
}
</script>
<style lang="scss">
    .swiper-pagination-bullet-active{
        background: #bb0068;
    }
    .indexBanner{
        height: 100%;
        width:100%;
        min-height:500px;
        img{
            width:100%;
            height:100%;
        }
        .swiper-pagination{
            display: none;
        }
    }
    /*首页搜索*/
    .index_search_wrap{
        background: rgba(0,0,0,0.5);
        z-index: 100;
        position: absolute;
        bottom: 0px;
        left:0;
        width:100%;
        height:60px;
        padding:30px 0px;
        // margin-left:-470px;
        .el-input{
            width:586px;
            input.el-input__inner{
                height:60px;
                outline: none;
                border-radius:4px 0 0 4px!important;
            }
        }
        button{
            width:124px;
            height:60px;
            border:1px solid #fff;
            color:#fff;
            font-size: 16px;
            border-radius: 4px;
            background:none;
            span{
                position: relative;
                top:2px;
            }
            &:hover{
                background: #eee;
                color:#000000;
            }
            &.search_btn{
                height:60px;
                width:60px;
                background:#03a9f4;
                border:none;
                border-radius: 0;
                &:hover{
                    background:#34b6f1;
                }
            }
            &.addr_btn{
                margin-right:8px;
                margin-left:28px;
                &:hover{
                    i{
                        background-position:-99px -58px;
                    }
                }
            }
            &.condition_btn{
                margin-left:10px;
                &:hover{
                    i{
                        background-position:3px 2px;
                    }
                }
            }
        }
    }


    .site-title{
        padding:15px 0;
        h2{
            font-weight: 340;
            small{
                font-weight: 400;
            }
        }
        a{
            margin-top:16px;
            &:hover{
                color:#bb0068;
            }
        }
    }
    /*swiper-wrapper*/
    .index-wrapper{
        .canSelHouseLists.swiper-container{
            margin-bottom:20px;
            overflow: hidden;
            width:1170px;
            .swiper-wrapper{
                width:100%;
                .swiper-slide{
                    float: left;
                }
            }
            .swiper-pagination{
                display: none;
            }
        }
        /*更多房源*/
        .canSelHouseLists .swiper-slide{
            /*box-shadow: 0 3px 2px 0 rgba(0, 0, 0, 0.12), 0 3px 2px 0 rgba(0, 0, 0, 0.12);*/
            margin:10px 0px 10px 0px;
            background: #ffff;
            border-radius: 3px;
            a{
                padding:15px;
                display: block;
                img{
                    width:240px;
                    height:150px;
                    margin-right:20px;
                    border-radius: 3px;
                }
                >div.fl{
                    width:285px;
                    height:150px;
                    h4{
                        width:100%;
                        height:26px;
                        line-height: 26px;
                        padding:10px 0 15px;
                        font-weight:500;
                        font-size:18px;
                    }
                    p{
                        padding-bottom:15px;
                        padding-left:30px;
                        height:20px;
                        line-height: 20px;
                        position: relative;
                        >i{
                            position: absolute;
                            top:4px;
                            left:0;
                        }
                    }
                }
                &:hover{
                    h4{
                        color:#bb0068;
                    }
                }
            }
        }
        .canSelHouseLists2 .swiper-slide a img{
            width:100%;
            margin-right:0;
        }
    }
    /*新闻*/
    .index_news_lists{
        >a,>div{
            display: block;
            overflow: hidden;
            width:585px;
            height:380px;
            float: left;
            position: relative;
        }
        >a{
            &:before{
                content: '';
                position: absolute;
                z-index: 5;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                background: -webkit-linear-gradient(top, transparent, rgba(0, 0, 0, 0.3) 60%, rgba(0, 0, 0, 0.8) 95%);
            }
            img{
                height:100%;
            }
            >div{
                z-index: 6;
                bottom:0;
                left:0;
                padding:10px 15px;
                >h4{
                    font-weight:400;
                }
            }
            &:hover:after{
                content:'';
                display: block;
                position: absolute;
                width:100%;
                height:100%;
                z-index: 7;
                top:0;
                left:0;
                background: rgba(0,0,0,0.3);
            }
        }
        >div{
            >a{
                &:before{
                    content: '';
                    position: absolute;
                    z-index: 5;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    background: -webkit-linear-gradient(top, transparent, rgba(0, 0, 0, 0.3) 60%, rgba(0, 0, 0, 0.8) 95%);
                }
                display: block;
                overflow: hidden;
                position: relative;
                &:nth-of-type(1){
                    height:175px;
                    img{
                        width:100%;
                        height:100%;
                    }
                }
                &:nth-of-type(2){
                    height:204px;
                    img{
                        width:100%;
                    }
                }
                >div{
                    padding:10px 15px;
                    z-index: 6;
                    bottom:0;
                    left:0;
                    >h4{
                        font-weight: 400;
                    }
                }
                &:hover:after{
                    content:'';
                    display: block;
                    position: absolute;
                    width:100%;
                    height:100%;
                    z-index: 7;
                    top:0;
                    left:0;
                    background: rgba(0,0,0,0.3);
                }
            }
        }
    }
    /*申请指南*/
    ul.index_guide_listst{
        li{
            float: left;
            a{
                display: block;
                width:240px;
                min-height:150px;
                padding:15px;
                box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.12), 0 1px 6px 0 rgba(0, 0, 0, 0.12);
                border-radius: 3px;
                margin-right:30px;
                cursor: default;
                background: #fff;
                img{
                    width:60%;
                }
                &:hover{
                    h4{
                        color:#bb0068;
                    }
                }
            }
            &:nth-of-type(4){
                a{
                    margin-right:0;
                }
            }
        }
    }
    .indexBg{
        border-radius:3px;
        background:url("../assets/images/IndexBg.png") no-repeat center;
        background-size:130% auto;
        height:200px;
    }
</style>
