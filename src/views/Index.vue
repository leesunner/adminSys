<template>
  <div class="index" ref="fullScreenBox">
    <div @click="screenStatus" class="full" :style="`background-image: url(${imgUrl});`" v-show="!screenStatu"></div>
    <el-row class="name">
      <p>某某村可视化数据</p>
    </el-row>
    <div class="content">
      <el-col class="left" :span="6">
        <div class="left-top">
          <p class="title">事件进度</p>
          <echarts-box class="canvas-item">
            <div class="item">
              <!--事件完成率统计-->
              <lee-echarts :options="event_pieOption" ref="event_pieOption1"></lee-echarts>
            </div>
            <div class="item">
              <!--事件处理中占比统计-->
              <lee-echarts :options="event_pieOption" ref="event_pieOption2"></lee-echarts>
            </div>
            <div class="item">
              <!--事件驳回占比统计-->
              <lee-echarts :options="event_pieOption" ref="event_pieOption3"></lee-echarts>
            </div>
            <div class="item">
              <!--事件完成率统计-->
              <lee-echarts :options="event_pieOption" ref="event_pieOption4"></lee-echarts>
            </div>
            <div class="item">
              <!--事件处理中占比统计-->
              <lee-echarts :options="event_pieOption" ref="event_pieOption5"></lee-echarts>
            </div>
            <div class="item">
              <!--事件驳回占比统计-->
              <lee-echarts :options="event_pieOption" ref="event_pieOption6"></lee-echarts>
            </div>
          </echarts-box>
        </div>
        <div class="left-center">
          <p class="title">事件提交时间分布</p>
          <echarts-box class="canvas-item">
              <lee-echarts :options="num_scatterOption" ref="num_scatterOption"></lee-echarts>
          </echarts-box>
        </div>
        <div class="canvas-item left-bottom">
          <p class="title">用户情况</p>
          <echarts-box class="canvas-item">
            <div class="item">
              <!--用户年龄段的统计-->
              <lee-echarts :options="age_pieOption" ref="age_pieOption"></lee-echarts>
            </div>
            <div class="item">
              <!--用户性别的统计-->
              <lee-echarts :options="sex_pieOption" ref="sex_pieOption"></lee-echarts>
            </div>
          </echarts-box>
        </div>
      </el-col>
      <el-col class="center" :span="11">
        <div class="canvas-item center-top">
          <div class="center-top-left">
            <lee-echarts :options="city_mapOption" ref="city_mapOption"></lee-echarts>
          </div>
          <div class="center-top-right">

          </div>
        </div>
        <div class="canvas-item center-bottom">
          <echarts-box>
            <lee-echarts :options="num_lineOption" ref="num_lineOption"></lee-echarts>
          </echarts-box>
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
  import echartsBox from '../components/echarts/itemBox/itemBox';
  // const leeEcharts = () => import('../components/echarts/index.vue')
  import leeEcharts from '../components/echarts/index.vue'
  import 'echarts/map/js/china.js'// 引入中国地图数据
  export default {
    name: "index",
    components: {leeEcharts, echartsBox},
    data() {
      return {
        //折线图
        num_lineOption: null,//业务数量
        //散点图
        num_scatterOption:null,//节点分布散点图
        //圆饼图（占比）
        age_pieOption: null,//年龄
        sex_pieOption: null,//性别
        event_pieOption: null,
        //柱状图
        barOption: null,
        //地图
        city_mapOption:null,
        screenStatu: false,
        imgUrl: require('@/assets/img/full.png'),
        docElm: null,
      }
    },
    beforeDestroy() {
      window.onresize = null
    },
    mounted() {
      this.$nextTick(() => {
        this.docElm = this.$refs['fullScreenBox'];
        this.docElm.addEventListener('fullscreenchange', () => {
          this.screenStatu = !this.screenStatu
          if (this.screenStatu) {
            this.imgUrl = require('@/assets/img/scale.png')
          } else {
            this.imgUrl = require('@/assets/img/full.png')
          }
        });
        //窗口变动监听
        window.onresize = (e) => {
          this.$refs['age_pieOption'].resize()
          this.$refs['sex_pieOption'].resize()
          this.$refs['num_lineOption'].resize()
          this.$refs['num_scatterOption'].resize()
          this.$refs['city_mapOption'].resize()
          for (let i = 0; i < 6; i++) {
            this.$refs[`event_pieOption${i + 1}`].resize()
          }
        }
        this.getAllRequest()
      })
    },
    methods: {
      getAllRequest() {
        this.getBusinessNumByTime()
        this.getAllUserNum()
        this.getAllUserSex()
        this.getBusinessNodeNumByTime()
      },
      //获取业务统计数量趋势
      getBusinessNumByTime() {
        this.$request.get(`${this.$apiList.summary}/business/time`,{
          params:{
            timePattern:'yyyy-MM-dd'
          }
        }).then(res => {
          const data = res.data.data
          this.num_lineOption = {
            title: {
              text: '业务数量趋势',
              x: 'center',
              textStyle: {
                fontSize: '16',
              },
              left:10,
              top:10,
            },
            grid: {//调整图形大小
              x:42,
              y:45,
              x2:22,
              y2:72
            },
            tooltip: {//鼠标提示
              trigger: 'axis',//随鼠标提示
              axisPointer: {
                type: 'cross',
                label: {
                  show: true,
                },
                lineStyle: {
                  type: 'dotted',
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
              axisLabel:{//设置坐标轴的标签
                interval:0,
                rotate:-15,
              },
              axisTick:{//刻度线
                show:true,
                inside:true,
                length:4,
                lineStyle:{
                  color:'#fff'
                }
              },
            },
            yAxis: {
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#eee',
                  type: 'dotted',
                  opacity: 0.1
                },
              },
              scale:true,
              axisLabel:{
                rotate:15,
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
                markPoint: {
                  symbol: 'circle',
                },
                smooth: true,//开启平滑
                smoothMonotone: 'x',//x方向平滑
                connectNulls: true,//连接空的点
                data: data.map(function (item) {
                  return item.value;
                }),
                areaStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                      offset: 0.3,
                      color: '#fcae61' // 0% 处的颜色
                    }, {
                      offset: 1,
                      color: '#d2f5a6' // 100% 处的颜色
                    }],
                    global: false, // 缺省为 false
                  },
                  opacity: 0.3
                },
                itemStyle: {
                  normal: {
                    lineStyle: {  //线的颜色
                      color: '#53baff',
                      opacity: 1,
                    },
                    //以及在折线图每个日期点顶端显示数字
                    label: {
                      show: true,
                      position: 'top',
                      textStyle: {
                        color: '#fff'
                      },
                      formatter: function (val) {
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
      //获取用户性别统计
      getAllUserSex() {
        this.$request.get(`${this.$apiList.summary}/users/sex`).then(res => {
          const data = res.data.data
          this.sex_pieOption = {
            title: {
              left: 20,
              top: 10,
              text: '用户性别占比',
              textStyle: {
                fontSize: '14',
              },
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
              bottom: 10,
              data: data.map(function (item) {
                return item.name
              })
            },
            series: [
              {
                name: '',
                type: 'pie',
                avoidLabelOverlap: false,
                label: {
                  normal: {
                    show: false,
                  },
                  emphasis: {
                    show: true,
                    textStyle: {
                      fontSize: '16',
                    },
                    formatter: '{b}: {d}%'
                  }
                },
                labelLine: {
                  normal: {
                    show: true,
                    length2: 5,
                  }
                },
                data: data
              }
            ]
          }
        })
      },
      //用户年龄统计
      getAllUserNum() {
        this.$request.get(`${this.$apiList.summary}/users/age`).then(res => {
          const data = res.data.data
          this.age_pieOption = {
            title: {
              text: '用户年龄分布',
              left: 20,
              top: 10,
              textStyle: {
                fontSize: '14',
              },
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
              bottom: 10,
              data: data.map(function (item) {
                return item.name
              })
            },
            series: [
              {
                name: '',
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
                      fontSize: '12',
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
          //测试数据
          this.event_pieOption = this._funs.copyObject(this.age_pieOption)
          this.event_pieOption.legend.show = false
          this.event_pieOption.title.text = '事件完成度'
          this.event_pieOption.title.top=5
          this.event_pieOption.title.left=5
          this.event_pieOption.title.textStyle.fontSize = 12
        })
      },
      //统计任务节点数量
      getBusinessNodeNumByTime(){
        this.$request.get(`${this.$apiList.summary}/business/task/time`,{
          params:{
            timePattern:'HH'
          }
        }).then(res => {
          const data = res.data.data
          this.num_scatterOption = {
            tooltip: {
              trigger: 'axis',//随鼠标提示
              axisPointer:{
                type:'none',
              }
            },
            grid: {//调整图形大小
              x:35,
              y:25,
              x2:10,
              y2:25
            },
            xAxis: {
              data: data.map(function (item) {
                return item.name;
              }),
              axisLabel:{
                rotate:-15,
              },
              axisTick:{
                show:true,
                inside:true,
                length:4,
                lineStyle:{
                  color:'#fff'
                }
              },
            },
            yAxis: {
              axisLabel:{
                rotate:30,
              },
            },
            series: [
              {
                name: '节点数量',
                type: 'scatter',
                data: data.map(function (item) {
                  return item.value;
                }),
                itemStyle: {
                  normal: {
                    //以及在折线图每个日期点顶端显示数字
                    label: {
                      show: true,
                      position: 'top',
                      textStyle: {
                        color: '#fff'
                      },
                    },
                    color: {
                      type: 'radial',
                      x: 0.5,
                      y: 0.5,
                      r: 0.5,
                      colorStops: [{
                        offset: 0, color: '#fcae61' // 0% 处的颜色
                      }, {
                        offset: 1, color: 'rgba(252,174,97,0.15)' // 100% 处的颜色
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
        } else if (this.docElm.webkitRequestFullscreen) {
          this.docElm.webkitRequestFullscreen();
        } else if (this.docElm.msRequestFullscreen) {
          this.docElm.msRequestFullscreen();
        } else {
          this.docElm.mozRequestFullscreen();
        }
      },
      //退出全屏
      endFullScreen() {
        if (this.docElm.exitFullscreen) {
          this.docElm.exitFullscreen();
        } else if (this.docElm.mozCancelFullScreen) {
          this.docElm.mozCancelFullScreen();
        } else if (this.docElm.msExitFullscreen) {
          this.docElm.msExiFullscreen();
        } else if (this.docElm.webkitCancelFullScreen) {
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
    padding-top: 30px;
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
    .name {
      position: absolute;
      top: 15px;
      left: 0;
      text-align: center;
      font-size: 30px;
      height: 60px;
      width: 100%;
      color: $white;
      background-image: url("../assets/img/titlepng.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-position: bottom;
    }
    .content {
      height: 100%;
      width: 100%;
      .title{
        color: $white;
        line-height: 45px;
      }
    }
    .canvas-item {
      @include flew_item('row');
      height: 85%;
      flex-wrap: wrap;
      &::before {
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
      margin-left: 1%;
      border-radius: 8px;
      &-top {
        height: 34%;
        .item {
          width: 33.333333333333%;
          height: 50%;
        }
      }
      &-center {
        height: 30%;
        .item {
          width: 50%;
          height: 100%;
        }
      }
      &-bottom {
        height: 34%;
        .item {
          width: 50%;
          height: 100%;
        }
      }
    }

    .center {
      height: 100%;
      margin-left: 1%;
      margin-right: 1%;
      border-radius: 8px;
      &-top {
        height: 60%;
        padding-top: 45px;
        padding-bottom: 45px;
        &-left{
          display: inline-block;
          width: 55%;
          vertical-align: middle;
        }
        &-right{
          display: inline-block;
          width: 45%;
          vertical-align: middle;
        }
      }
      &-bottom {
        height: 38.5%;
      }
    }

    .right {
      height: 100%;
      margin-right: 1%;
      border-radius: 8px;
    }

    :-webkit-full-screen {
    }

    :-moz-full-screen {
    }

    :-ms-fullscreen {
    }

    :fullscreen {
    }
  }
</style>
