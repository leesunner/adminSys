<template>
  <div class="echart" ref="echartContent">
    <div ref="canvas" :style="`height: ${height}px;width: ${width}px;`"></div>
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
        height:window.innerHeight,
        width:window.innerWidth-200,
        echarEle:null
      }
    },
    props:['options'],
    mounted() {
      this.$nextTick(()=>{
        this.echarEle = this.$refs.echartContent
        window.onresize = (e) =>{
          this.height = this.echarEle.clientHeight
          this.width = this.echarEle.clientWidth
          this.canvas.resize();
        }
        //注入自定义主题
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
<style lang="scss" scoped>
.echart{
  /*height: 100%;*/
  width: 100%;
}
</style>
