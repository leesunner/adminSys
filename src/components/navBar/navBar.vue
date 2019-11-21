<template>
  <div class="left">
    <!--<div class="left-control" @click="isCollapse = !isCollapse">{{isCollapse?'展开':'收起'}}</div>-->
    <el-scrollbar style="height: 100%;">
      <el-menu
        :default-active="$route.path"
        unique-opened
        class="el-menu-vertical-demo"
        @open="handleOpen"
        background-color="#272b40"
        router
        text-color="#fff"
        :collapse="isCollapse"
        active-text-color="#ffd04b">
        <nav-item v-for="(menu,index) in menuList" :key="index+100" :item="menu"></nav-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
  import navItem from './navBaritem'
  import {permissionMenus} from '@/tools/routerTool'
  import {mapMutations} from 'vuex'

  export default {
    name: "AsideLeft",
    components: {navItem},
    data() {
      return {
        isCollapse: false,
        menuList: [],
      };
    },
    created() {
      const list = this.$store.state.login.ROUTERS_LIST
      this.menuList = list[0].children

    },
    methods: {
      ...mapMutations([
        'setMenuNavTabs'
      ]),
      handleOpen(key, keyPath) {
        // this.setMenuNavTabs({
        //   type:'add',//remove
        //   value:key,
        // })
      },
    }
  }
</script>

<style lang="scss" scoped>
  .left {
    background-color: #272b40;
    height: 100%;
    overflow: hidden;
    position: relative;
    &-control{
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto 0;
      width: 30px;
      height: 28px;
      z-index: 30;
      background-color: $primary;
      font-size: 12px;
      color: $white;
      padding: 3px 3px;
      cursor: pointer;
    }
    & /deep/ .el-scrollbar__wrap {
      overflow-x: hidden;
      margin-right: -18px !important;
    }
    & /deep/ .el-submenu__title, & /deep/ .el-menu-item {
      @include text-over
    }
  }
</style>
