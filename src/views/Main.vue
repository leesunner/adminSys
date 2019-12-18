<template>
  <div class="index">
    <el-container style="height: 100%;">
      <el-header>
        <lee-header></lee-header>
      </el-header>
      <el-container style="height: 100%;">
        <el-aside style="height: 100%" width="auto">
          <nav-bar></nav-bar>
        </el-aside>
        <el-main style="overflow: hidden;">
          <nav-bar-tabs v-if="$route.path!=='/index'"></nav-bar-tabs>
          <el-scrollbar style="height: 100%;padding-bottom: 35px;">
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
      padding-left: 10px;
      padding-right: 10px;
      margin-bottom: 15px;
    }
  }
</style>
