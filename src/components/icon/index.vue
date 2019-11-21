<template>
  <div class="icon">
    <i :class="['iconfont',icon]" :style="`color:${color};font-size:${fontSize}px;`"></i>
  </div>
</template>

<script>
    export default {
        name: "lee-icon",
      props:{
        icon:{
          type:String,
          default:''
        },
        color:{
          type:String,
          default:'#DCDFE6'
        },
        fontSize:{
          type:Number,
          default:28
        },
      }
    }
</script>

<style lang="scss" scoped>
  .icon{
    position: absolute;
    z-index: 10;
    width: 30px;
    height: 30px;
    top: 0;
    left: 7px;
    margin: 5px auto;
    text-align: center;
    line-height: 30px;
  }
</style>
