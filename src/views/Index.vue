<template>
  <div class="index" ref="fullScreenBox">
    <div @click="screenStatus" class="full" :style="`background-image: url(${imgUrl});`" v-show="!screenStatu"></div>
    <el-row class="title">
      <p>某某村可视化数据</p>
    </el-row>
    <div class="content">
      <el-col class="left" :span="6">
        <div class="canvas-item">
          <lee-echarts :options="pieOption" ref="pieOption"></lee-echarts>
        </div>
        <div class="canvas-item">

        </div>
      </el-col>
      <el-col class="center" :span="11">
        <div class="canvas-item center-top">
          <!--<lee-echarts :options="option1" ref="canvas2"></lee-echarts>-->
        </div>
        <div class="canvas-item center-bottom">
          <lee-echarts :options="lineOption" ref="lineOption"></lee-echarts>
        </div>
      </el-col>
      <el-col class="right" :span="6">
        <div class="canvas-item">
          <!--<lee-echarts :options="option" ref="canvas3"></lee-echarts>-->
        </div>
        <div class="canvas-item">

        </div>
      </el-col>
    </div>
  </div>
</template>

<script>
  // const leeEcharts = () => import('../components/echarts/index.vue')
  import leeEcharts from '../components/echarts/index.vue'
  // import 'echarts/map/js/china.js'// 引入中国地图数据
  export default {
    name: "index",
    components: {leeEcharts},
    data() {
      return {
        //折线图
        lineOption: null,
        //圆饼图（占比）
        pieOption: null,
        //柱状图
        pictorialBarOption:null,
        screenStatu: false,
        imgUrl: require('@/assets/img/full.png'),
        docElm:null,
      }
    },
    beforeDestroy(){
      window.onresize=null
    },
    mounted(){
      this.$nextTick(()=>{
        this.docElm = this.$refs['fullScreenBox'];
        this.docElm.addEventListener('fullscreenchange', ()=>{
          this.screenStatu = !this.screenStatu
          if (this.screenStatu){
            this.imgUrl = require('@/assets/img/scale.png')
          }else{
            this.imgUrl = require('@/assets/img/full.png')
          }
        });
        //窗口变动监听
        window.onresize = (e) =>{
          this.$refs['pieOption'].resize()
          this.$refs['lineOption'].resize()
          // this.$refs.canvas3.resize()
        }
        this.getAllRequest()
      })
    },
    methods: {
      getAllRequest(){
        this.getBusinessNumByTime()
        this.getALLUserNum()
      },
      //获取业务统计数量趋势
      getBusinessNumByTime(){
        this.$request.get(`${this.$apiList.summary}/business/time`).then(res=>{
          const data = res.data.data
          this.lineOption = {
            title: {
              text: '业务数量趋势',
              x: 'center'
            },
            tooltip: {
              trigger: 'axis',//随鼠标提示
              axisPointer: {
                type: 'cross',
                label:{
                  show:true,
                },
              }
            },
            xAxis: {
              data: data.map(function (item) {
                return item.name;
              }),
              // axisLine:{
              //   symbol:['none','arrow']
              // },
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#eee',
                  type:'dotted',
                  opacity:0.1
                },
              },
              axisLabel:{
                interval:0,
              },
            },
            yAxis: {
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#eee',
                  type:'dotted',
                  opacity:0.1
                },
              },
            },
            dataZoom: [{
              startValue: '2015'
            }, {
              type: 'inside'
            }],
            series: [
              {
                name: '业务数量',
                type: 'line',
                smooth: true,//开启平滑
                smoothMonotone:'x',//x方向平滑
                connectNulls:true,//连接空的点
                data: data.map(function (item) {
                  return item.value;
                }),
                areaStyle:{
                  color:{
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 1,
                    colorStops: [{
                      offset: 0,
                      color: '#76f2f2' // 0% 处的颜色
                    }, {
                      offset: 1,
                      color: '#72ccff' // 100% 处的颜色
                    }],
                    global: false, // 缺省为 false
                  },
                  opacity:0.3
                },
                itemStyle:{
                  show:true,
                  normal: {
                    lineStyle : {  //线的颜色
                      color : '#53baff',
                      opacity:1,
                    },
                    //以及在折线图每个日期点顶端显示数字
                    label: {
                      show: true,
                      position: 'top',
                      textStyle: {
                        color: '#fff'
                      },
                      formatter:function (val) {
                        return `${val.value}个`
                      }
                    },
                    color: {
                      type: 'radial',
                      x: 0.5,
                      y: 0.5,
                      r: 0.5,
                      colorStops: [{
                        offset: 0, color: 'green' // 0% 处的颜色
                      }, {
                        offset: 1, color: 'blue' // 100% 处的颜色
                      }],
                      global: false // 缺省为 false
                    }
                  }
                }
              }
            ]
          }
        })
      },
      //用户统计
      getALLUserNum(){
        this.$request.get(`${this.$apiList.summary}/users/age`).then(res=>{
          const data = res.data.data
          this.pieOption = {
            title:{
              text:'用户年龄分布',
              right:10,
              top:10,
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              left: 10,
              top:10,
              data: data.map(function (item) {
                return item.name
              })
            },
            series: [
              {
                name: '用户年龄段',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                  normal: {
                    show: false,
                    position: 'center'
                  },
                  emphasis: {
                    show: true,
                    textStyle: {
                      fontSize: '16',
                      fontWeight: 'bold'
                    },
                    formatter: '{b}: {d}%'
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: data
              }
            ]
          }
        })
      },
      screenStatus() {
        if (this.screenStatu) {
          this.endFullScreen()
        } else {
          this.fullScreen()
        }
      },
      //开始全屏
      fullScreen() {
        if (this.docElm.requestFullscreen) {
          this.docElm.requestFullscreen();
        }else if (this.docElm.webkitRequestFullscreen){
          this.docElm.webkitRequestFullscreen();
        }else if (this.docElm.msRequestFullscreen){
          this.docElm.msRequestFullscreen();
        }else{
          this.docElm.mozRequestFullscreen();
        }
      },
      //退出全屏
      endFullScreen() {
        if(this.docElm.exitFullscreen){
          this.docElm.exitFullscreen();
        }else if(this.docElm.mozCancelFullScreen){
          this.docElm.mozCancelFullScreen();
        }else if(this.docElm.msExitFullscreen){
          this.docElm.msExiFullscreen();
        }else if(this.docElm.webkitCancelFullScreen){
          this.docElm.webkitCancelFullScreen();
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .index {
    position: relative;
    background-image: url("../assets/img/indebackgimg.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center;
    padding-top: 15px;
    .full {
      position: absolute;
      top: 30px;
      right: 30px;
      z-index: 300;
      width: 30px;
      color: #ffffff;
      height: 30px;
      text-align: center;
      cursor: pointer;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-position: center;
    }
  }
  .title{
    text-align: center;
    font-size: 30px;
    height: 60px;
    color: $white;
    background-image: url("../assets/img/titlepng.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: bottom;
  }
  .content{
    height: 93%;
    width: 100%;
  }
  .canvas-item{
    height: 50%;
    &::before{
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      background-image: url("../assets/img/lefttop.png");
      background-repeat: no-repeat;
    }
  }
  .left {
    height: 100%;
    background-color: rgba(0,0,0,0.3);
    margin-left: 1%;
    border-radius: 8px;
  }

  .center {
    height: 100%;
    background-color: rgba(0,0,0,0.3);
    margin-left: 1%;
    margin-right: 1%;
    border-radius: 8px;
    &-top{
      height: 60%;
    }
    &-bottom{
      height: 40%;
    }
  }

  .right {
    height: 100%;
    background-color: rgba(0,0,0,0.3);
    margin-right: 1%;
    border-radius: 8px;
  }
  :-webkit-full-screen { }

  :-moz-full-screen { }

  :-ms-fullscreen { }

  :fullscreen { }
</style>
