<template>
    <div class="container  clearfix" ref="box">
        <div class="screen-search-breadcrumb">
            <!-- 面包屑&搜索 -->
            <div class="clearfix search-breadcrumb">
                <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb_nav fl">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>门店列表</el-breadcrumb-item>
                </el-breadcrumb>
                <div class="fr search-wrap">
                    <el-input v-model="search_input" placeholder="请输入小区关键词" clearable class="marR10"></el-input>
                    <el-button type="primary" @click="serchScreen()">搜索</el-button>
                </div>
            </div>
            <!-- 筛选条件 -->
            <div class="screen-wrap">
                <div class="clearfix screen-item marB10">
                    <h4 class="fl c-3 bold">区域：</h4>
                    <ul class="clearfix fl">
                        <li v-for="(item,index) in screenLists" :key="index" :class="{active:item.isActive}" @click="checkScreen(item.AreaName,1,index,item.AreaId)">{{item.AreaName}}</li>
                    </ul>
                </div>
            </div>

            <!-- 清空筛选 -->
            <div class="clear-screen clearfix">
                <h4 class="fl c-3 bold fl c-3 bold">已选条件：</h4>
                <div class="fl clearfix">
                    <ul class="checked-screen fl marL10 clearfix">
                        <li v-for="(item,index) in checkedScreenLists">{{item.name}}<i class='fa fa-times' @click="deleteScreen(item.name,item.type,item.index,item.id)"></i></li>
                    </ul>
                    <el-button size="mini" plain type="danger" @click="clearScreen()" :disabled="checkedScreenLists.length==0">清空选项</el-button>
                </div>
            </div>
        </div>
        <h4 class="fs26 c-6 village-house-tit">共<span class="red">{{listsTotal}}</span>个门店：</h4>
        <div class="village-house-wrap" v-loading="loading">
            <p class="noDataText padT20 padB20 tc fs16 green" v-show='villageLists.length == 0'>无数据!&nbsp;&nbsp;-_-!!!</p>
            <ul class="village-house-lists">
                <li v-for="(item,index) in villageLists" :key="index" class="clearfix rel">
                    <router-link :to="`/StoreDetails/${item.PropertyId}`" class="clearfix">
                        <img v-lazy="(item.MainPic == null || item.MainPic == '') ? defaultImg : item.MainPic " class="fl" :alt="item.FullHead">
                        <div class="fl marL30">
                            <h4 class="c-6 fs26">{{item.Name}}</h4>
                            <p class="c-6 marT20"><i class="fa fa-map-marker fa-lg rel" style="margin-right:13px;left:2px;" aria-hidden="true"></i><span class="bold">所属区域：</span><span class="c-7">{{item.RegionName}}</span></p>
                            <p class="c-6 marT20"><i class="fa fa-street-view fa-lg rel" style="margin-right:9px;" aria-hidden="true"></i><span class="bold">地址：</span><span class="c-7">{{item.Address}}</span></p>
                            <p class="c-6 marT20"><i class="fa fa-university rel" style="margin-right:8px;" aria-hidden="true"></i><span class="bold">门店简介：</span><span class="c-7">{{item.Memo}}</span></p>
                        </div>
                    </router-link>
                    <router-link :to="{name:'户型',query:{id:item.PropertyId}}" class="abs fs18 lookForhouse c-6">
                        <span class="green">{{item.RoomCount | filterRoomCount}}</span>
                        个户型，点击查看
                    </router-link>
                </li>
            </ul>
            <!-- 工具条 -->
            <el-pagination v-show='villageLists.length != 0' class="tc" @current-change="handleCurrentChange" background :page-size="pageSize" layout="prev, pager, next" :total="listsTotal">
            </el-pagination>
        </div>
    </div>
</template>
<script type="es6">
    import { getStoreLists,getScreenArea} from '../api/api.js'
    import defaultImg from '../assets/images/room_default.jpg'
    import { isNull } from '../util'
    export default{
        data(){
            return{
                areaSel:'不限',
                modelPhoneScreenLists:false,

                defaultImg,
                isActive:true,
                search_input:'',
                AreaId : null,
                screenLists:[
                    {
                        name:'不限',
                        isActive:true
                    },{
                        name:'杭头',
                        isActive:false
                    },{
                        name:'回南',
                        isActive:false
                    },{
                        name:'金阳',
                        isActive:false
                    },{
                        name:'金阳',
                        isActive:false
                    },{
                        name:'金阳',
                        isActive:false
                    },
                ],
                checkedScreenLists:[

                ],
                villageLists:[],
                loading: false,
                listsTotal:0,
                page : 1,
                pageSize : 10
            }
        },
        mounted(){
            this.$nextTick(() => {
                this.$refs.box.style.minHeight = (document.documentElement.clientHeight - document.getElementById('footer').offsetHeight - document.getElementById('header').offsetHeight -30) +'px'
            })
        },
        filters:{
            filterRoomCount(val){
                if(val == null || val == ''){
                    return 0;
                }else{
                    return val
                }
            }
        },
        methods:{

            serchScreen(){
                if(this.search_input !="" && !isNull(this.search_input)){
                    this.checkedScreenLists = this.checkedScreenLists.filter(item => item.type !== 0)
                    this.checkedScreenLists.push({name:this.search_input,type:0})
                    this.loading = true;
                    this.getVillageListsFunc()
                }else{
                    this.$message({
                        message: '请输入关键字',
                        type: 'warning'
                    });
                }
            },
            checkScreen(val,type,index,id){
                for(var i = 0;i<this.screenLists.length;i++){
                    this.screenLists[i].isActive = false
                }
                this.screenLists[index].isActive = true
                if(val !== '不限'){
                    this.checkedScreenLists = this.checkedScreenLists.filter(item => item.type !== type)
                    this.checkedScreenLists.push({name:val,type:type,index:index,id:id})
                    this.AreaId = id
                }else{
                    this.checkedScreenLists = this.checkedScreenLists.filter(item => item.type !== type)
                    this.AreaId = null
                }
                this.loading = true;
                this.getVillageListsFunc()
                //手机端
                this.areaSel = val
                this.modelPhoneScreenLists = false
            },
            //删除筛选条件
            deleteScreen(val,type,index,id){
                this.checkedScreenLists = this.checkedScreenLists.filter(item => item.name !== val)
                if(type==1){//区域
                    this.screenLists[index].isActive = false
                    this.screenLists[0].isActive = true
                    this.AreaId = null
                }else if(type==0){
                    this.search_input = ''
                }
                this.loading = true;
                this.getVillageListsFunc()
                this.areaSel = "不限"
            },
            //清空筛选条件
            clearScreen(){
                if(this.checkedScreenLists.length){
                    for(var i =0;i<this.checkedScreenLists.length;i++){
                        if(this.checkedScreenLists[i].type == 1){
                            this.screenLists[0].isActive = true
                            this.screenLists[this.checkedScreenLists[i].index].isActive = false
                        }
                    }
                    this.checkedScreenLists = []
                    this.loading = true;
                    this.search_input = ''
                    this.AreaId = ''
                    this.getVillageListsFunc()
                }
            },
            //改变当前页数
            handleCurrentChange(val) {
                // console.log(`当前页: ${val}`);
                this.page = val
                this.loading = true;
                this.getVillageListsFunc()
            },
            //获取小区列表
            getVillageListsFunc(){
                this.loading = true
                var params = {
                    QueryJson:{
                        // Type: '1',
                        KeyWord : this.search_input,
                        AreaId:this.AreaId,
                        RoomState:1,
                    },
                    Page:this.page,
                    Rows:this.pageSize,
                }
                getStoreLists(params).then(response => {
                    switch(response.StatusCode){
                        case 500 :
                            this.$message.error('门店列表请求失败'+response.Info)
                            break;
                        case 200:
                            this.villageLists = response.Data.Rows
                            this.listsTotal = response.Data.Records

                    }
                    this.loading = false
                }).catch( error=> {
                    this.$message.error(error);
                });
            },
            //获取区域筛选条件
            getScreenAreaFunc(){
                getScreenArea({CityCode:"310100",AreaCode:"",Type:2}).then(response => {
                    var data = [{
                        AreaName:'不限',
                        AreaId:null,
                        isActive:true
                    }]
                    for(var i =0;i<response.Data.length;i++){
                        data.push({
                            isActive:false,
                            AreaName:response.Data[i].AreaName,
                            AreaId:response.Data[i].AreaId
                        })
                    }
                    this.screenLists = data
                }).catch(error => {
                    this.$message.error(error);
                })
            },
            //手机模式筛选条件
            showModelPhoneScreenLists(){
                if(this.modelPhoneScreenLists == false){
                    this.modelPhoneScreenLists = true
                }else{
                    this.modelPhoneScreenLists = false
                }
            },
        },
        created(){
            if(this.$route.query.id){
                this.search_input = this.$route.query.id
                this.checkedScreenLists.push({name:this.search_input,type:0})
            }
            this.getScreenAreaFunc()
            this.getVillageListsFunc()
        },
    }
</script>
<style lang="scss">
.lookForhouse{
    padding:10px;
    border:1px solid #bb0068;
    top:10px;
    border-radius: 3px;
    background: #ecf5ff;
}
</style>
