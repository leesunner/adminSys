<template>
  <div class="echart"  ref="echartContent" :style="`height: ${height};width: ${width};background-color:${backGroundColor};`">
    <div ref="canvas" style="width:100%;height: 100%;"></div>
  </div>
</template>

<script>
  import * as $e from 'echarts';
  // 自定义主题
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
      backGroundColor:{
        type: String,
        default:'rgba(6,41,100,.85)'
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
          this.setOption()
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
        //不用上面的是为了初始化时解决地图位置不居中的问题
        // this.init()
      },
      //注册点击事件 type:注册标识
      registerOnEvent(){
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
        let index = 0
        this.canvas.on('mouseover', function (e) {
          index = e.dataIndex
          that.chooseVuale('highlight',0,index)
        });
        this.canvas.on('mouseout', function (e) {
            that.chooseVuale('downplay',0,index)
        });
      },
      //默认选择部分
      chooseVuale(type,seriesIndex,dataIndex){
        this.canvas.dispatchAction({type: type,seriesIndex: seriesIndex,dataIndex: dataIndex})
      },
      //初始化echarts
      init() {
        this.echarEle = this.$refs.echartContent
        this.canvas = $e.init(this.$refs.canvas, 'chalk')
        this.setOption()
      },
      //设置数据源
      setOption() {
        if(this.options&&this.canvas){
          this.canvas.setOption(this.options)
          this.resize()
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
</style>
