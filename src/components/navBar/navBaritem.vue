<template>
  <fragment style="height:100%">
    <template v-for="item in menuList">
      <template v-if="!item.children">
        <el-tooltip class="item" effect="dark" :content="item.menuName" placement="right">
          <el-menu-item :index="item.url" @click="handleOpen(item)" :route="{path:item.url}" :key="item.url">
            <i class="el-icon-position"></i>
            <span slot="title">{{item.menuName}}</span>
          </el-menu-item>
        </el-tooltip>
      </template>
      <el-submenu v-else :index="`${item.id}+'path'`" :key="item.id">
        <nav-bar-item :menuList="item.children"/>
        <template slot="title">
            <i class="el-icon-position"></i>
            <span slot="title">{{item.menuName}}</span>
        </template>
      </el-submenu>
    </template>
  </fragment>
</template>

<script>
  import {mapMutations} from 'vuex'

  export default {
    name: "nav-bar-item",
    props: ['menuList'],
    methods: {
      ...mapMutations([
        'setMenuNavTabs'
      ]),
      handleOpen(value) {
        //跳转打开页面时，设置内容页tab的数组
        if (value.menuPath){
          this.setMenuNavTabs({
            type: 'add',//remove
            value: value,
          })
        }else {
          this.$message.warning('功能页面尚未开发!')
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .nav-bar-item {
    padding-left: 30px !important;
    min-width: inherit !important;
  }
</style>
