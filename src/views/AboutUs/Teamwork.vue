<template>
    <section class="container">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb_nav">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>关于我们</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/teamwork' }">合作联系</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="main-content">
            <h2 class="title is-2">合作联系</h2>

            <div class="">
				合作联系
            </div>
        </div>
    </section>
</template>
<script>


export default {
  data() {
      return{}
  },
}
</script>
<style media="screen">
.viewImg{
  margin: 30px;
}
.title {
  font-size: 24px;
  font-weight: bold;
  line-height: 1.2;
  color: #333;
}

.title:hover {
  color: #333 !important;
}
</style>
