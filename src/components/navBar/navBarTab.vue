<template>
  <el-tabs v-model="editableTabsValue" class="navBarTab" type="card" @tab-click="chooseTab" @edit="handleTabsEdit">
    <el-tab-pane
      closable
      lazy
      :key="item.name"
      v-for="(item, index) in getMenuNavTabs"
      :label="item.title"
      :name="item.name"
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
      '$route.name'(newValue){
        //切换到当前访问的路由tab
        this.editableTabsValue = newValue
      },
      getMenuNavTabs:{
        handler(newValue,oldValue){
          //关闭对应路由时，跳转一个路由，并显示选中的tab
          newValue.length<=0?this.$router.push('index'):this.$router.push(oldValue[0].path)
        },
        deep:true,
      }
    },
    created(){
      this.editableTabsValue = this.$route.name
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
