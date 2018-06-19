<template>
    <div id="app">
        <ComHeader/>
        <div class="wapper" ref="box" :class="{new_login:headToggle===1}">
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
    computed : {
        ...mapGetters(['headToggle']),
    },
    mounted(){
        console.log(this.$store.getters.headToggle)
        this.$nextTick(() =>{

                this.$refs.box.style.minHeight = (document.documentElement.clientHeight - document.getElementById('footer').offsetHeight - document.getElementById('header').offsetHeight -30) +'px'

        });
    },
}
</script>

<style lang='scss'>
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
.new_login{
    padding-top:0!important;
}
</style>
