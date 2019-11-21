<template>
  <div class="echart">
    <div ref="canvas" :style="`height: ${$attrs.height}px;width: ${$attrs.width}px;`"></div>
  </div>
</template>

<script>
  import * as $e from 'echarts';
  import theme from '@/assets/echarts/theme';
  export default {
    name: "index",
    data() {
      return {
        canvas: null,
      }
    },
    props:['options'],
    mounted() {
      this.$nextTick(()=>{
        $e.registerTheme('chalk', theme)
        this.init()
        this.setOption()
      })
    },
    methods:{
      init(){
        let that = this
        this.canvas = $e.init(this.$refs.canvas,'chalk')
        this.canvas.on('mouseover', function (e) {
              that.canvas.setOption({
                tooltip:{
                  formatter:`${e.name}:${e.value}`
                }
              })
          });
      },
      setOption(){
        this.canvas.setOption(this.options)
      },
    }
  }
</script>
<style scoped>

</style>
