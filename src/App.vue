<template>
    <div id="app">
        <ComHeader/>
        <div class="wapper" ref="box">
            <keep-alive>
                <router-view v-if='$route.meta.keepAlive'/>
            </keep-alive>
            <router-view v-if='!$route.meta.keepAlive'/>
        </div>
        <Footer/>
    </div>
</template>

<script>
import ComHeader from './components/ComHeader'
import Footer from './components/Footer'
// import { getMemberMSGList } from './api/api.js'
import { mapGetters } from 'vuex'
import { getCookie } from './util'
export default {
    name: 'App',
    components : {
        ComHeader,
        Footer
    },
    mounted(){
        this.$nextTick(() =>{
            this.$refs.box.style.minHeight = (document.documentElement.clientHeight - document.getElementById('footer').offsetHeight - document.getElementById('header').offsetHeight -30) +'px'
        });
    },
}
</script>

<style lang='scss'>
.wapper{
    padding-top:60px;
}
body{
    /*overflow-x: hidden;*/
    .wapper{
        padding-top:60px;
        width:100%;
    }
    .el-message{
        min-width:200px!important;
    }
}

</style>
