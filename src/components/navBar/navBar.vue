<template>
  <div class="left" @mouseover="showBox" @mouseleave="hiddenBox">
    <div class="left-control" @click="controlBtn" ref="leftControl">
      <i :class="['touch',isCollapse?'el-icon-arrow-right':'el-icon-arrow-left']"></i>
    </div>
    <el-scrollbar style="height: 100%;">
      <el-menu
        :default-active="$route.path"
        unique-opened
        class="el-menu-vertical-demo"
        background-color="#292F37"
        router
        text-color="#fff"
        :collapse="isCollapse"
        active-text-color="#409EFF">
          <nav-item :menuList="menuList"></nav-item>
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
        'setMenuNavTabs',
        'setLeftControl'
      ]),
      controlBtn(){
        this.isCollapse = !this.isCollapse
        this.setLeftControl(this.isCollapse)
      },
      showBox(){
        this.$refs['leftControl'].style.transform = 'translateX(0px)'
      },
      hiddenBox(){
        this.$refs['leftControl'].style.transform = 'translateX(20px)'
      },
    }
  }
</script>

<style lang="scss" scoped>
  .left {
    background-color: #292F37;
    height: 100%;
    padding-bottom: 10px;
    overflow: hidden;
    position: relative;
    &-control{
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto 0;
      width: 20px;
      height: 36px;
      z-index: 30;
      background-color: $primary;
      font-size: 12px;
      padding: 3px 3px;
      cursor: pointer;
      line-height: 36px;
      transition: all 0.15s ease-in-out;
      transform: translateX(20px);
      .touch{
        font-size: 18px;
        color: $white;
      }
      .touch:hover{
        transform: scale3d(1,1.35,1);
      }
    }
    & .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 200px;
      min-height: auto;
      padding-bottom:68px;
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
