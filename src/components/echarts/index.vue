<template>
  <div class="echart" ref="echartContent" :style="`height: ${height};width: ${width};`">
    <div ref="canvas" style="width:100%;height: 100%;"></div>
  </div>
</template>

<script>
  import * as $e from 'echarts';
  import theme from '@/assets/echarts/theme';

  export default {
    name: "index",
    props: {
      height: {
        type: String,
        default: '100%'
      },
      width: {
        type: String,
        default: '100%'
      },
      options: {
        type: Object,
        default: {}
      },
    },
    data() {
      return {
        canvas: null,
        echarEle: null,
      }
    },
    watch: {
      '$store.state.leftControl'(newVal) {
        this.resize();
      },
      options:{
        handler(newVal){
          if (newVal){
            this.setOption()
          }
        },
        deep:true,
        immediate:true,
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.echarEle = this.$refs.echartContent
        //注入自定义主题
        $e.registerTheme('chalk', theme)
        this.init()
      })
    },
    methods: {
      //初始化echarts
      init() {
        let that = this
        this.canvas = $e.init(this.$refs.canvas, 'chalk')
        this.canvas.on('mouseover', function (e) {
          that.canvas.setOption({
            tooltip: {
              formatter: `${e.name}:${e.value}`
            }
          })
        });
        this.$emit('handlerInit',true)
      },
      //设置数据源
      setOption() {
        this.canvas.setOption(this.options)
      },
      //重绘
      resize(){
        this.canvas.resize();
      }
    }
  }
</script>
<style lang="scss" scoped>
  .echart {
    position: relative;
  }
</style>
