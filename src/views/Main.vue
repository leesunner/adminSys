<template>
  <!--<el-scrollbar style="height: 100%;">-->
    <div class="index">
      <el-container style="height: 100%;">
        <el-header>
          <lee-header></lee-header>
        </el-header>
        <el-container style="height: 100%;">
          <el-aside width="auto">
            <nav-bar></nav-bar>
          </el-aside>
          <el-main style="overflow: hidden;padding: 0;">
            <nav-bar-tabs v-if="$route.path!=='/index'"></nav-bar-tabs>
            <router-view v-if="$route.path==='/index'"/>
            <el-scrollbar style="height: 100%;" class="mainScroll" v-else>
              <div class="content">
                <!--<keep-alive>-->
                <router-view/>
                <!--</keep-alive>-->
              </div>
            </el-scrollbar>
          </el-main>
        </el-container>
      </el-container>
    </div>
  <!--</el-scrollbar>-->
</template>

<script>
  import ElHeader from "element-ui/packages/header/src/main";

  const navBar = () => import('@/components/navBar/navBar.vue');
  const navBarTabs = () => import('@/components/navBar/navBarTab.vue');
  const leeHeader = () => import('@/components/header/index.vue')
  export default {
    name: "index",
    components: {
      ElHeader,
      navBar, navBarTabs, leeHeader
    },
    data() {
      return {}
    },
  }
</script>
<style lang="scss" scoped>
  .index {
    height: 100%;
    & .el-header {
      padding: 0;
      overflow: hidden;
      height: auto !important;
    }
    & .el-main{
      padding: 10px;
    }
    .content{
      padding: 10px 20px;
      margin-bottom: 15px;
    }
  }
  .mainScroll{
    & /deep/ .el-scrollbar__view{
      margin-bottom: 120px;
    }
  }
</style>
