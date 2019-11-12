<template>
  <div class="left">
    <!--<el-radio-group v-model="isCollapse">-->
    <!--<el-radio-button :label="false">展开</el-radio-button>-->
    <!--<el-radio-button :label="true">收起</el-radio-button>-->
    <!--</el-radio-group>-->
    <el-scrollbar style="height: 100%;">
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="#545c64"
        router
        text-color="#fff"
        :collapse="isCollapse"
        active-text-color="#ffd04b">
        <nav-item v-for="(menu,index) in menuList" :key="index+100" :item="menu" ></nav-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
  import navItem from './navBaritem'
  export default {
    name: "AsideLeft",
    components:{navItem},
    data() {
      return {
        isCollapse: false,
        menuList: [
          {
            title: '首页',
            path: '/login',
            children: []
          },
          {
            title: '角色管理',
            path: '/login',
            children: [
              {
                title: '角色管理',
                name: 'login',
                path: '/login',
                children: [
                  {
                    title: '角色添加',
                    name: 'login',
                    path: '/login',
                  }
                ]
              },
              {
                title: '角色权限',
                name: 'login',
                path: '/login',
                children: [
                  {
                    title: '权限树',
                    name: 'login',
                    path: '/login',
                  }
                ]
              }
            ]
          },
        ]
      };
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .left {
    background-color: rgb(84, 92, 100);
    height: 100%;
    overflow: hidden;
    & /deep/ .el-scrollbar__wrap {
      overflow-x: hidden;
      margin-right: -18px!important;
    }
    & /deep/ .el-submenu__title, & /deep/ .el-menu-item {
      padding-left: 0 !important;
    }
  }
</style>
