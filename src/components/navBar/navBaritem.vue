<template>
  <div v-if="item.children">
    <template v-if="item.children.length == 0">
      <el-menu-item :index="item.path" @click="handleOpen(item)">
        <i class="el-icon-menu"></i>
        {{item.title}}
      </el-menu-item>
    </template>

    <el-submenu v-else :index="item.path?item.path:'path'">
      <template slot="title">
        <i class="el-icon-menu"></i>
        {{item.title}}
      </template>
      <template v-for="(child,index) in item.children">
        <!--递归菜单-->
        <nav-bar-item
          v-if="child.children&&child.children.length>0"
          :item="child"
          :key="index+200"/>
        <el-menu-item v-else :key="child.path" :index="child.path" class="nav-bar-item" @click="handleOpen(child)">
          <i class="el-icon-location"></i>
          {{child.title}}
        </el-menu-item>
      </template>
    </el-submenu>
  </div>
</template>

<script>
  import {mapMutations} from 'vuex'
  export default {
    name: "nav-bar-item",
    props: ['item'],
    methods:{
      ...mapMutations([
        'setMenuNavTabs'
      ]),
      handleOpen(value) {
        //跳转打开也面时，设置内容页tab的数组
        this.setMenuNavTabs({
          type:'add',//remove
          value:value,
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
.nav-bar-item{
  padding: 0!important;
  min-width: inherit!important;
}
</style>
