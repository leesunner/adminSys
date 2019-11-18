<template>
  <div class="index">
    <el-container style="height: 100%;">
      <el-header style="background-color: #333333">
        <el-dropdown trigger="click">
  <span class="el-dropdown-link">
    点我查看<i class="el-icon-caret-bottom el-icon--right"></i>
  </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item class="clearfix">
              评论
              <el-badge class="mark" :value="12"/>
            </el-dropdown-item>
            <el-button @click="loginOut">
              退出
            </el-button>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-container style="height: 100%;">
        <el-aside width="180px" style="height: 100%" class="el-scrollbar">
          <nav-bar></nav-bar>
        </el-aside>
        <el-main>
          <nav-bar-tabs v-if="$route.path!=='/index'"></nav-bar-tabs>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  const navBar = () => import('@/components/navBar/navBar.vue');
  const navBarTabs = () => import('@/components/navBar/navBarTab.vue')
  import {mapActions} from 'vuex'

  export default {
    name: "index",
    components: {navBar, navBarTabs},
    data() {
      return {}
    },
    methods: {
      ...mapActions([
        'loginOut'
        ])
    }
  }
</script>
<style lang="scss" scoped>
  .index {
    height: 100%;
  }
</style>
