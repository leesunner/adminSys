<template>
  <el-tabs v-model="editableTabsValue" class="navBarTab" type="card" @tab-click="chooseTab" @edit="handleTabsEdit">
    <el-tab-pane
      closable
      lazy
      :key="item.id"
      v-for="item in getMenuNavTabs"
      :label="item.menuName"
      :name="item.url"
    >
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import {mapMutations, mapGetters} from 'vuex'

  export default {
    name: "nav-bar-tab",
    data() {
      return {
        editableTabsValue: '',
      }
    },
    watch:{
      '$route.path'(newValue){
        //切换到当前访问的路由tab
        this.editableTabsValue = newValue
      },
    },
    created(){
      this.editableTabsValue = this.$route.path
    },
    computed:{
      ...mapGetters([
        'getMenuNavTabs'
      ])
    },
    methods:{
      ...mapMutations([
        'setMenuNavTabs'
      ]),
      //选中tab跳转对应页面
      chooseTab(tab){
        this.$router.push(tab.name)
      },
      //关闭tab时同时处理tab导航数组
      handleTabsEdit(targetName, action){
        this.setMenuNavTabs({
          type:action,//remove
          value:targetName,
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  .navBarTab{
  }
</style>
