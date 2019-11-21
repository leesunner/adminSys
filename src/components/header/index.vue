<template>
  <div class="header">
    <el-button @click="$store.dispatch('loginOut')">
      退出
    </el-button>
  </div>
</template>

<script>
    export default {
        name: "index"
    }
</script>

<style lang="scss" scoped>
.header{
  background-color: #29c8c9;
  text-align: right;
  height: 100%;
}
</style>
