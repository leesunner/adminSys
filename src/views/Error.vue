<template>
  <div class="fail">
    <p>您要的页面没找到404!!!!!!!!!!!!</p>
    <p class="cus" @click="goback">返回上一页</p>
  </div>
</template>

<script>
  export default {
    name: "error",
    methods:{
      goback(){
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .fail {
    line-height: 100px;
    font-size: 45px;
    color: red;
  }
  .cus{
    cursor: pointer;
  }
</style>
