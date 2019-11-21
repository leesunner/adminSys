<template>
  <div class="index">
    <el-container style="height: 100%;">
      <el-header>
        <lee-header></lee-header>
      </el-header>
      <el-container style="height: 100%;">
        <el-aside style="width:200px;height: 100%" class="el-scrollbar">
          <nav-bar></nav-bar>
        </el-aside>
        <el-main class="el-scrollbar">
          <nav-bar-tabs v-if="$route.path!=='/index'"></nav-bar-tabs>
          <router-view/>
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
      height: 76px !important;
    }
  }
</style>
