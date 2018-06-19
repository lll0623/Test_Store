<template>
    <div>
        <section class="container" ref="box">
            <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb_nav">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>{{ typeText }}</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="main-content"  v-loading="loading">
                <p class="noDataText padT20 padB20 tc fs16 green" v-show='items.length == 0'>无数据!&nbsp;&nbsp;-_-!!!</p>
                <ul class="entry-list" ref="entry">
                    <li class="list-item" v-for="(item, index) in items">
                        <router-link :to="`/newsdetails/${item.Id}`">
                            <div class="entry">
                                <div class="content-box">
                                        <div class="thumb">
                                            <img v-lazy="(item.MainPic == null) ? localImg :item.MainPic" :alt="item.FullHead">
                                        </div>
                                        <div class="info-box">
                                            <div class="info-row title-row">
                                                    <span class="title" :style="{color:'#'+item.FullheadColor}">{{ item.FullHead }}</span>
                                                <div class="date">{{ item.CreateDate }}</div>
                                            </div>
                                            <div class="content-view" v-html="unescape(item.NewsContent)"></div>
                                        </div>
                                </div>
                            </div>
                        </router-link>
                    </li>
                </ul>
                <el-pagination v-show='items.length != 0' class="tc marT20" @current-change="handleCurrentChange" background
                    :page-size="pageSize"
                    :current-page="page"
                    layout="prev, pager, next"
                    :total="listsTotal">
                </el-pagination>
            </div>
        </section>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getNews } from '../api/api.js'
import defaultImg from '../assets/images/room_default.jpg'

  export default {
    name: 'news-guide',
      data() {
        return {
          news:[],
          loading:true,
          listsTotal:null,
          page : 1,
          pageSize : 15,
          items:'',
          typeText:"",
          localImg: defaultImg
        }
      },
      computed:{
          ...mapGetters(['newsGuideType'])
      },
      created(){
            this.typeText = "新闻";
            this.getNewslist();
      },
      mounted(){
          this.$nextTick(() =>{
              this.$refs.box.style.minHeight = (document.documentElement.clientHeight - document.getElementById('footer').offsetHeight - document.getElementById('header').offsetHeight -30) +'px'
          });
      },
    methods:{
        //改变当前页数
        handleCurrentChange(val) {
            this.page = val
            this.loading = true;
            setTimeout(()=>{
                this.loading = false;
            },1000)
            this.getNewslist();
        },
        getNewslist() {
            var params = {
                Page:this.page,
                Rows:this.pageSize,
                QueryJson:{
                    "Type":1
                }
            }
              getNews(params).then((response) =>{
                  switch(response.StatusCode){
                      case 500 :
                          this.$message.error('新闻列表请求失败'+response.Info)
                          break;
                      case 200:
                          this.items = (response.Data == null) ? [] : response.Data.Rows;
                          this.listsTotal = (response.Data == null) ? 0 : response.Data.Records;
                  }
                  this.loading = false
              }).catch(error => {
                  this.$message.error(error)
              })
        },
        unescape(html){
            return html
            .replace(html ? /&(?!#?\w+;)/g : /&/g, '&amp;')
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, "\"")
            .replace(/&#39;/g, "\'");
        }
    }
  }
</script>
<style lang="scss">
.entry-list {
    width: 100%;
    background: #fff;
}

.list-item {
    border-bottom: 1px solid rgba(178, 186, 194, .15);
}

.list-item:not(:last-child) {
    border-bottom: 1px solid rgba(178, 186, 194, .15);
}

.content-box {
    clear: both;
    display: inline-block;
    padding: 20px;
}

.info-box {
    margin: 20px 0 0 220px;
}

.content-view {
    margin-top: 10px;
    font-size: 16px;
    color: #999;
    text-indent: 2em;
}

.thumb {
    float: left;
    width: 11.9rem;
    height: 11.75rem;
    background-color: #f1f1f1;
    border-radius: 3px;
    cursor: pointer;
    position:relative;
}

.thumb img {
    position: absolute;
    width: 100%;
    height:100%;
    border-radius: 3px;
}

.title-row {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.title {
    font-size: 24px;
    font-weight: bold;
    line-height: 1.2;
    color: #333;
    cursor: pointer;
}

.title:hover {
    color: #bb0068;
}

.date {
    margin-top: 5px;
    margin-top: 0.5rem;
    font-size: 12px;
    color: #999;
}
</style>
