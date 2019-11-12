<template>
  <div class="index" >
    <el-container style="height: 100%;">
      <el-header style="background-color: #333333">Header</el-header>
      <el-container style="height: 100%;">
        <el-aside width="180px" style="height: 100%" class="el-scrollbar">
          <aside-left></aside-left>
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  const AsideLeft = () => import('../components/left/left.vue');

  export default {
    name: "index",
    components: {AsideLeft},
    data(){
      return{

      }
    },
  }
</script>
<style lang="scss" scoped>
  .index {
    height: 100%;
  }
</style>
