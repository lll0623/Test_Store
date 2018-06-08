<template>
    <div id="header" ref="header">
        <div class="header" v-if="headToggle==0">
            <div class="container clearfix rel">
                <router-link to="/" class="fl block">
                    <img src="../assets/images/logo.png" class="nlogo vm marR15">
                    <span class='fs28 white nlogo_text rel'>LINK&nbsp;新界</span>
                </router-link>
                <el-menu class="el-menu-demo index_nav fr" mode="horizontal">
                    <template v-for= "(item,index) in $router.options.routes">
                        <el-submenu :index= "index+''" v-if="item.leaf && !item.hidden">
                            <template slot="title">
                                <i :class="item.iconCls"></i>
                                <span slot="title">{{item.name}}</span>
                            </template>
                            <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="child.path != '' && child.name !='提交申请'">
                                <router-link :to="child.path">
                                    <i :class="child.iconCls"></i>
                                    <span>{{child.name}}</span>
                                </router-link>
                            </el-menu-item>
                            <el-menu-item :index="child.path" :key="child.path" v-else-if="child.path != '' && child.name =='提交申请'">
                                <a href="javascript:;" class='block' @click="hasIDCard('/applyFor')">
                                    <span>{{child.name}}</span>
                                </a>
                            </el-menu-item>
                            <el-menu-item :index="child.path" :key="child.path" v-else-if="child.path != '' && child.name =='个人中心'">
                                <a href="javascript:;" class='block' @click="hasIDCard('/myCenter')">
                                    <span>{{child.name}}</span>
                                </a>
                            </el-menu-item>
                            <el-menu-item :index="child.path" :key="child.path" v-else>
                                <a href="javascript:;" class='block' @click="logOut()">
                                    <span>{{child.name}}</span>
                                </a>
                            </el-menu-item>
                        </el-submenu>
                        <el-menu-item  :index="item.path" :key="item.path" v-if="!item.leaf&&!item.hidden">
                            <router-link :to="item.path">
                                <i :class="item.iconCls"></i>
                                {{item.name}}
                            </router-link>
                        </el-menu-item>
                    </template>
                </el-menu>
            </div>
        </div>
        <div class="login-header header clearfix" v-if="headToggle===1" style="background:#fff;">
            <router-link to="/" class="fl block">
                <img src="../assets/images/logo2.png" class="logo vm marR15">
            </router-link>
            <router-link to="/" class="fr block marR20">
                <span class="tit green fs16 marR15">返回首页</span>
                <i class="fa fa-chevron-right green"></i>
            </router-link>
        </div>
    </div>
</template>
<script type="es6">
import { mapGetters } from 'vuex'
import { getCookie,setCookie } from '../util'
export default {
    computed : {
        ...mapGetters(['headToggle','userInfo']),
        getUserInfo(){
            return this.$store.getters.userInfo
        },
    },
    watch: {
        getUserInfo(val) {
            if(val){
                this.$router.options.routes[7].hidden = true
                this.$router.options.routes[8].hidden = true
                this.$router.options.routes[9].hidden = false
                this.$router.options.routes[9].name = '您好，'+JSON.parse(getCookie('userInfo')).Name
            }else{
                this.$router.options.routes[7].hidden = false
                this.$router.options.routes[8].hidden = false
                this.$router.options.routes[9].hidden = true
                this.$router.options.routes[9].name = ''
            }
        },
    },
    methods:{
        //登出
        logOut(){
            this.$confirm('是否退出?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                    type: 'warning'
            }).then(() => {
                // setCookie('userInfo','', -1)
                // setCookie('applyForData','',-1)
                this.$cookie.delete('userInfo')
                this.$store.commit('SET_USERINFO','')
                this.$router.options.routes[7].hidden = false
                this.$router.options.routes[8].hidden = false
                this.$router.options.routes[9].hidden = true
                this.$router.options.routes[9].name = ''
                this.$message({
                    type: 'success',
                    message: '已退出登录'
                });
                this.$router.push("/login");
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },
    },
    created(){
        if(this.$store.getters.userInfo){
            this.$router.options.routes[7].hidden = true
            this.$router.options.routes[8].hidden = true
            this.$router.options.routes[9].hidden = false
            this.$router.options.routes[9].name = '您好，'+JSON.parse(getCookie('userInfo')).Name
        }else{
            this.$router.options.routes[7].hidden = false
            this.$router.options.routes[8].hidden = false
            this.$router.options.routes[9].hidden = true
            this.$router.options.routes[9].name = ''
        }
    },
}
</script>
<style lang="scss">
#header{
    position:fixed;
    width:100%;
    top:0;
    left:0;
    z-index:2001;
}
/*header*/
.header{
    background: #3d424d;
    height:60px;
    .container{
        background: #3d424d;
        position:relative;
        .step_tip{
            height:24px;
            line-height: 24px;
            padding:0 8px;
            color:#fff;
            background: #f44336;
            z-index: 1;
            border-radius:24px;
            font-size:12px;
            right:-50px;
            top:8px;
        }
    }
    img{
        position: relative;
        height:60px;
    }
    .nlogo{
        width:80px;
        /* border-radius: 2px; */
    }
    .nlogo_text{
        top:7px;
    }
    .logo{
        width:180px;
    }
    .tit{
        line-height: 60px;
    }
    ul{
        li{
            a,div{
                display: block;
                font-size:16px;
                &.router-link-active,&:hover{
                    color:#009688!important;
                }
            }
        }
    }
    .el-menu--horizontal>.el-menu-item:not(.is-disabled):focus{
        background: none!important;
    }
    ul.index_nav{
        line-height: 60px;
        border:none!important;
        background: none;
        li{
            float: left;
            &.is-active{
                border-bottom: none!important;
                .el-submenu__title{
                    border-bottom: none!important;
                }
            }
            &.is-opened{
                .el-submenu__title{
                    span{
                        color:#009688!important;
                    }
                }
            }
            &:hover{
                background: none!important;
            }
            a{
                color:#f0f0f0;
                &:hover{
                    i{
                        &.i-login{
                            background-position: -2px -57px;
                        }
                    }
                }
            }
            .el-submenu__title {
                &:hover,&:focus{
                    background: none!important;

                }
                span{
                    color:#f0f0f0!important;
                }
            }
            div{
                &.server{
                    cursor:pointer;
                    color:#f0f0f0;
                    position: relative;
                    padding-right:20px;
                    &:after{
                        content:'';
                        position:absolute;
                        display: block;
                        vertical-align: middle;
                        border-top: 4px dashed;
                        border-top: 4px solid\9;
                        border-right: 4px solid transparent;
                        border-left: 4px solid transparent;
                        top:28px;
                        right:6px;
                    }
                    &:hover{
                        ul.hidden_navs{
                            display: block;
                        }
                    }
                }
            }
        }
    }

    /*nav iocn*/
    .i-login{
        width:18px;
        height:18px;
        background-size: 145px auto;
        background-position: -24px -30px;
        position: relative;
        top:-2px;
    }
}
/*二级导航*/
div.el-menu--horizontal{
    box-shadow: 0px 0px 8px #666!important;
    border-radius: 3px!important;
    position: relative;
    &:after{
        content:'';
        display: block;
        width: 0;
        height: 0;
        vertical-align: middle;
        border-top: 8px dashed;
        border-top: 8px solid\9;
        border-right: 8px solid transparent;
        border-left: 8px solid transparent;
        transform: rotate(-180deg);
        position: absolute;
        right: 45%;
        top: -5px;
        bottom: 0;
        color: #fff;
        z-index: 99999;
    }
    ul.el-menu--popup{
        min-width:140px!important;
        margin-top:0!important;
        li{
            height:42px!important;
            line-height: 42px!important;
            a{
                display: block;

                span{
                    font-size: 16px;
                    display: block;
                    text-align: center;

                }
            }
            &:hover{
                background: #ddd;
                span{
                    color:#009688!important;

                }
            }
        }
    }
}
.login-header{
    box-shadow: 0px 6px 30px #ddd;
}
</style>
