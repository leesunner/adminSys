<template>
    <div class="par-box" :class="$attrs.class">
      <div class="par-box-l-top boxsize"></div>
      <div class="par-box-l-bottom boxsize"></div>
      <div class="par-box-r-top boxsize"></div>
      <div class="par-box-r-bottom boxsize"></div>
      <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "item-box"
    }
</script>

<style lang="scss" scoped>
.par-box{
  position: relative;
  width: 100%;
  height: 100%;
  border: solid 1px rgba(65,162,255,.3);
  .boxsize{
    width: 8px;
    height: 8px;
  }
  &-l-top{
    position: absolute;
    top: 0;
    left: 0;
    border-left: solid 2px $borderRadius;
    border-top: solid 2px $borderRadius;
  }
  &-l-bottom{
    position: absolute;
    bottom: 0;
    left: 0;
    border-left: solid 2px $borderRadius;
    border-bottom: solid 2px $borderRadius;
  }
  &-r-bottom{
    position: absolute;
    bottom: 0;
    right: 0;
    border-right: solid 2px $borderRadius;
    border-bottom: solid 2px $borderRadius;
  }
  &-r-top{
    position: absolute;
    top: 0;
    right: 0;
    border-right: solid 2px $borderRadius;
    border-top: solid 2px $borderRadius;
  }
}
</style>
