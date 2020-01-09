<template>
  <div class="echart" :class="!$attrs.showBackground?'showBackground':''" ref="echartContent" :style="`height: ${height};width: ${width};`">
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
        initOnNum:0,//限制只注册一次
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
        //注入自定义主题
        $e.registerTheme('chalk', theme)
        this.init()
      })
    },
    methods: {
      //注册地图
      beginShowMap(name,json){
        $e.registerMap(name,json)
        this.setOption()
      },
      //注册点击事件 type:注册标识
      registerOnEvent(type){
        if (!this.initOnNum){
          this.initOnNum = 1
          let that = this
          this.canvas.on('click', function(params) {
            that.$emit('clickEvent', params)
          })
        }
      },
      //注册鼠标移入事件
      mouseOverEvent(){
        let that = this
        this.canvas.on('mouseover', function (e) {

        });
      },
      //初始化echarts
      init() {
        this.echarEle = this.$refs.echartContent
        this.canvas = $e.init(this.$refs.canvas, 'chalk')
      },
      //设置数据源
      setOption() {
        if(this.options!==null){
          this.canvas.setOption(this.options)
        }
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
  .showBackground{
    /*background-color: #062964;*/
    background-color: $borderBackColor;
  }
</style>
