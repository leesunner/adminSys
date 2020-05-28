<template>
  <div class="index" ref="fullScreenBox">
    <div @click="screenStatus" class="full" :style="`background-image: url(${imgUrl});`" v-show="!screenStatu"></div>
    <el-row class="name">
      <p class="title">数字政务平台</p>
    </el-row>
    <div class="content">
      <el-col class="left" :span="6">
        <div class="left-top">
          <p class="title">各部门今日事件完成率</p>
          <echarts-box class="canvas-item">
            <div class="item">
              <lee-echarts :options="event_pieOption1" ref="event_pieOption1" v-show="rateList.length>0"></lee-echarts>
              <div class="noInfo" v-if="rateList.length==0">暂无数据</div>
            </div>
            <div class="item">
              <lee-echarts :options="event_pieOption2" ref="event_pieOption2" v-show="rateList.length>0"></lee-echarts>
              <div class="noInfo" v-if="rateList.length==0">暂无数据</div>
            </div>
            <div class="item">
              <lee-echarts :options="event_pieOption3" ref="event_pieOption3" v-show="rateList.length>0"></lee-echarts>
              <div class="noInfo" v-if="rateList.length==0">暂无数据</div>
            </div>
            <div class="item">
              <lee-echarts :options="event_pieOption4" ref="event_pieOption4" v-show="rateList.length>0"></lee-echarts>
              <div class="noInfo" v-if="rateList.length==0">暂无数据</div>
            </div>
            <div class="item">
              <lee-echarts :options="event_pieOption5" ref="event_pieOption5" v-show="rateList.length>0"></lee-echarts>
              <div class="noInfo" v-if="rateList.length==0">暂无数据</div>
            </div>
            <div class="item">
              <lee-echarts :options="event_pieOption6" ref="event_pieOption6" v-show="rateList.length>0"></lee-echarts>
              <div class="noInfo" v-if="rateList.length==0">暂无数据</div>
            </div>
          </echarts-box>
        </div>
        <div class="left-center">
          <p class="title">今日业务数据</p>
          <echarts-box class="canvas-item">
            <lee-echarts :options="num_barOption" ref="num_barOption" v-if="businessNodeNumList.length>0"></lee-echarts>
            <div class="noInfo" v-else>暂无数据</div>
          </echarts-box>
        </div>
        <div class="left-bottom">
          <p class="title">用户情况</p>
          <echarts-box class="canvas-item">
            <div class="item">
              <!--用户年龄段的统计-->
              <lee-echarts :options="age_pieOption" ref="age_pieOption" v-if="userAges.length>0"></lee-echarts>
              <div class="noInfo" v-else>暂无数据</div>
            </div>
            <div class="item">
              <!--用户性别的统计-->
              <lee-echarts :options="sex_pieOption" ref="sex_pieOption" v-if="userSexs.length>0"></lee-echarts>
              <div class="noInfo" v-else>暂无数据</div>
            </div>
          </echarts-box>
        </div>
      </el-col>
      <el-col class="center" :span="11">
        <div class="center-top">
          <ul class="center-top-bread">
            <li v-for="item in tabTitleArr" :key="item.locationCode" @click="changeTabTitle(item)">
              {{item.locationName}}
            </li>
          </ul>
          <!--地图-->
          <lee-echarts
            :options="city_mapOption"
            showBackground="transparent"
            ref="city_mapOption"
            @clickEvent="clickEvent"></lee-echarts>
        </div>
        <div class="center-bottom">
          <echarts-box>
            <lee-echarts :options="num_lineOption" ref="num_lineOption"
                         v-if="businessNumByTimeList.length>0"></lee-echarts>
            <div class="noInfo" v-else>暂无数据</div>
          </echarts-box>
        </div>
      </el-col>
      <el-col class="right" :span="6">
        <div class="right-top">
          <echarts-box>
            <div class="box-con">
              <ul class="numCount">
                <li>
                  <span class="numCount-text">在线用户数：</span>
                  <span class="numCount-num">{{animatedOnlineUsersCount}}</span>
                  <span class="numCount-text">人</span>
                  <!--<span class="numCount-text">人</span>-->
                </li>
                <li>
                  <span class="numCount-text">总用户数：</span>
                  <span class="numCount-num">{{animatedAllPersonCount}}</span>
                  <span class="numCount-text">人</span>
                </li>
                <!--<li>-->
                  <!--<span class="numCount-text">事件总数：</span>-->
                  <!--<span class="numCount-num">{{animatedAllCount}}</span>-->
                  <!--&lt;!&ndash;<span class="numCount-text">件</span>&ndash;&gt;-->
                <!--</li>-->
                <li>
                  <span class="numCount-text">处理中：</span>
                  <span class="numCount-num">{{animatedWorkingCount}}</span>
                  <span class="numCount-text">件</span>
                </li>
                <li>
                  <span class="numCount-text">已完成：</span>
                  <span class="numCount-num">{{animatedAllFinisedCount}}</span>
                  <span class="numCount-text">件</span>
                </li>
                <li>
                  <span class="numCount-text">今日完成率：</span>
                  <span class="numCount-num">{{animatedFinishedPrecent}}</span>
                </li>
              </ul>
            </div>
          </echarts-box>
        </div>
        <div class="right-bottom">
          <div class="title">
            <!--<img src="../assets/img/dicync.gif"/>-->
            实时事件播报
          </div>
          <echarts-box class="canvas-item-right">
            <el-scrollbar style="height: 100%;">
              <ul class="newList" v-if="newsList.length>0">
                <li v-for="(item,index) in newsList" :key="index+10">
                  <div class="newList-index">
                    <p>事件</p>
                    <p>{{index<10?'0'+(index+1):index}}</p>
                  </div>
                  <div class="newList-content">
                    <div class="newList-content-title">{{item.businessName+'--'+item.businessTaskName}}</div>
                    <div class="newList-content-bottom">
                      <div>
                        <span>处理状态：</span>
                        <span class="status">{{item.stateCn}}</span>
                      </div>
                      <div>
                        <span>处理时间：</span>
                        <span>{{item.startTime}}</span>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="noInfo" v-else>暂无数据</div>
            </el-scrollbar>
          </echarts-box>
        </div>
      </el-col>
    </div>
  </div>
</template>
<script>
  import echartsBox from '../components/echarts/frameBox';
  import leeEcharts from '../components/echarts/index.vue';
  import axios from '@/request/api/echartsReuqest';
  // import 'echarts/map/js/province/hubei.js'// 引入中国地图数据
  import TweenAminate from '../tools/TweenLite.js'
  //数字和单位分隔符
  function toParNum(num) {
    for (let i in num) {
      if ((i + 1) % 3 === 0 && i < num.length - 1) {
        let q = i - 2
        num[q] = num[q] + ','
      }
    }
    return num.join('');
  }

  export default {
    name: "index",
    components: {leeEcharts, echartsBox},
    data() {
      return {
        //折线图
        num_lineOption: null,//业务数量
        //散点图
        num_scatterOption: null,//节点分布散点图
        //圆饼图（占比）
        age_pieOption: null,//年龄
        sex_pieOption: null,//性别
        event_pieOption1: null,
        event_pieOption2: null,
        event_pieOption3: null,
        event_pieOption4: null,
        event_pieOption5: null,
        event_pieOption6: null,
        //柱状图
        num_barOption: null,
        //地图
        city_mapOption: null,
        screenStatu: false,
        imgUrl: require('@/assets/img/full.png'),
        docElm: null,
        locationData: {
          locationName: '湖北省',
          locationCode: 420000,
          locationLevel: 1
        },
        tabTitleArr: [//存title的数据源
          {
            locationName: '湖北省',
            locationCode: 420000,
            locationLevel: 1
          }
        ],
        tweenedAllCount: 0,//事件总数结果
        tweenedAllNumber: 0,//事件总数
        workingCount: 0,//处理中事件总数结果
        workingNumber: 0,//处理中事件总数
        nowOnlineUsers: 0,//在线人数
        nowOnlineUser: 0,//在线人数结果
        finisedNumber: 0,//已完成事件总数
        finisedCount: 0,//已完成事件总数结果
        allPersonNumber:0,//总人数
        allPersonCount:0,//总人数结果
        newsList: [],
        businessNumByTimeList: [],
        businessNodeNumList: [],
        userSexs: [],
        userAges: [],
        rateList:[],
        interVal:null,//定时器
      }
    },
    beforeDestroy() {
      window.onresize = null
      this.clearInterVal()
    },
    //字体动画效果 ----------开始
    computed: {
      //事件总数结果
      // animatedAllCount: function () {
      //   if (this.tweenedAllCount > 1000) {
      //     let num = this.tweenedAllCount.toFixed(0).toString().split('')
      //     return toParNum(num);
      //   } else {
      //     return this.tweenedAllCount.toFixed(0)
      //   }
      // },
      //处理中事件总数结果
      animatedWorkingCount: function () {
        if (this.workingCount > 1000) {
          let num = this.workingCount.toFixed(0).toString().split('')
          return toParNum(num);
        } else {
          return this.workingCount.toFixed(0)
        }
      },
      //在线人数结果
      animatedOnlineUsersCount: function () {
        if (this.nowOnlineUser > 1000) {
          let num = this.nowOnlineUser.toFixed(0).toString().split('')
          return toParNum(num);
        } else {
          return this.nowOnlineUser.toFixed(0)
        }
      },
      //在线总人数
      animatedAllPersonCount: function () {
        if (this.allPersonCount > 1000) {
          let num = this.allPersonCount.toFixed(0).toString().split('')
          return toParNum(num);
        } else {
          return this.allPersonCount.toFixed(0)
        }
      },
      //已完成的
      animatedAllFinisedCount: function () {
        if (this.finisedCount > 1000) {
          let num = this.finisedCount.toFixed(0).toString().split('')
          return toParNum(num);
        } else {
          return this.finisedCount.toFixed(0)
        }
      },
      //已完成的比率
      animatedFinishedPrecent(){
        this.tweenedAllNumber = this.tweenedAllNumber||1
        let num = (this.finisedCount/this.tweenedAllNumber)*100
        return num.toFixed(2)+'%'
      }
    },
    watch: {
      // tweenedAllNumber: function (newValue) {
      //   TweenAminate.TweenLite.to(this.$data, 0.5, {tweenedAllCount: newValue});
      // },
      nowOnlineUsers: function (newValue) {
        TweenAminate.TweenLite.to(this.$data, 0.5, {nowOnlineUser: newValue});
      },
      workingNumber: function (newValue) {
        TweenAminate.TweenLite.to(this.$data, 0.5, {workingCount: newValue});
      },
      finisedNumber: function (newValue) {
        TweenAminate.TweenLite.to(this.$data, 0.5, {finisedCount: newValue});
      },
      allPersonNumber: function (newValue) {
        TweenAminate.TweenLite.to(this.$data, 0.5, {allPersonCount: newValue});
      },
    },
    // ----------结束
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
          this.$refs['age_pieOption']?this.$refs['age_pieOption'].resize():'';
          this.$refs['age_pieOption']?this.$refs['sex_pieOption'].resize():'';
          this.$refs['num_lineOption']?this.$refs['num_lineOption'].resize():'';
          this.$refs['num_barOption']?this.$refs['num_barOption'].resize():'';
          this.$refs['city_mapOption']?this.$refs['city_mapOption'].resize():'';
          for (let i = 0; i < 6; i++) {
            if (this.$refs[`event_pieOption${i + 1}`]){
              this.$refs[`event_pieOption${i + 1}`].resize()
            }
          }
        }
        this.getAllRequest()
      })
    },
    methods: {
      //清楚定时器
      clearInterVal(){
        clearInterval(this.interVal)
        this.interVal = null
      },
      //定时器
      getInterval(){
        this.interVal = setInterval(()=>{
          this.getAllRequest()
        },5000)
      },
      //请求地图数据
      getAllRequest() {
        this.getMapAndData()
      },
      //复制对象属性值
      copyClickMapData(data) {
        let obj = {}
        obj.locationName = data.name || data.locationName
        obj.locationCode = data.locationCode
        obj.locationLevel = data.locationLevel
        return obj
      },
      //获取业务统计数量趋势(中下)
      getBusinessNumByTime() {
        axios.get(`${this.$apiList.summary}/business/time`, {
          params: {
            timePattern: 'yyyy-MM-dd',
            locationCode: this.locationData.locationCode
          }
        }).then(res => {
          const data = res.data.data
          this.businessNumByTimeList = data
          this.num_lineOption = {
            title: {
              text: '业务数量趋势',
              x: 'center',
              textStyle: {
                fontSize: '16',
              },
              left: 10,
              top: 10,
            },
            grid: {//调整图形大小
              x: 42,
              y: 45,
              x2: 22,
              y2: 72
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
              axisLabel: {//设置坐标轴的标签
                interval: 0,
                rotate:-18,
              },
              axisTick: {//刻度线
                show: true,
                inside: true,
                length: 4,
                alignWithLabel: true,
              },
            },
            yAxis: {
              splitLine: {
                show: true,
                lineStyle: {
                  type: 'dotted',
                  opacity: 0.1
                },
              },
              scale: true,
              axisLabel: {
                rotate: 15,
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
                      color: '#53baff' // 0% 处的颜色
                    }, {
                      offset: 1,
                      color: 'rgba(83,186,255,0.15)' // 100% 处的颜色
                    }],
                    global: false, // 缺省为 false
                  },
                  // opacity: 0.3
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
                      formatter: function (val) {
                        return `${val.value}个`
                      },
                      color: '#0EE5F8'
                    },
                  }
                }
              }
            ]
          }
        })
      },
      //获取用户性别统计
      getAllUserSex() {
        axios.get(`${this.$apiList.summary}/users/sex`, {
          params: this.locationData
        }).then(res => {
          const data = res.data.data
          this.userSexs = data
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
              formatter: '{b}: {c} ({d}%)'
            },
            legend: {
              data: data.map(function (item) {
                return item.name
              }),
              itemWidth: 16.5,
              itemHeight: 10,
              bottom: 6
            },
            series: [
              {
                name: '',
                type: 'pie',
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
        axios.get(`${this.$apiList.summary}/users/age`, {
          params: this.locationData
        }).then(res => {
          const data = res.data.data
          this.userAges = data
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
              data: data.map(function (item) {
                return item.name
              }),
              itemWidth: 16.5,
              itemHeight: 10,
              bottom: 10
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
                top: 15,
                data: data
              }
            ]
          }
        })
      },
      //统计柱状图（左二）今日数据
      getBusinessNodeNumByTime() {
        let data = this._funs.copyObject(this.locationData)
        let time = new Date()
        data.month = time.getMonth()+1
        data.year = time.getFullYear()
        data.day = time.getDate()
        axios.get(`${this.$apiList.summary}/business/count/top`, {
          params: data
        }).then(res => {
          const data = res.data.data
          this.businessNodeNumList = data
          this.num_barOption = {
            title: {
              text: '',
              x: 'center',
              textStyle: {
                fontSize: '16',
              },
              left: 10,
              top: 10,
            },
            tooltip: {
              trigger: 'axis',//随鼠标提示
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {
              data: ['处理中', '已完成'],
              itemHeight: 12,
              itemWidth:19,
              textStyle: {
                color: ["#fcae61", "#5873ff"]
              },
              top: 6,
              right:6,
              itemGap: 5,
              selectedMode: true,//图例选择模式
            },
            dataZoom: [{
              startValue: data.length>0?data[0].businessName:''
            }, {
              type: 'inside'
            }],
            grid: {//调整图形大小
              x: 35,
              y: 40,
              x2: 10,
              y2: 65
            },
            xAxis: {
              type: 'category',
              data: data.map(function (item) {
                return item.businessName;
              }),
              axisLabel: {
                rotate: -15,
                show:true,
                interval: 0,
                position: 'center',
              },
              axisTick: {
                show: true,
                length: 4,
                alignWithLabel: true,
              },
            },
            yAxis: {
              axisLabel: {
                rotate: 30,
              },
            },
            series: [
              {
                name: '处理中',
                type: 'bar',
                data: data.map(function (item) {
                  return item.processing;
                }),
                itemStyle: {
                  normal: {
                    label: {
                      show: false,
                      position: 'top',
                      textStyle: {
                        color: '#fcae61'
                      },
                      formatter:'{c}'
                    },
                    color: {
                      type: 'linear',
                      x: 0,
                      y: 1,
                      x2: 0,
                      y2: 0,
                      colorStops: [{
                        offset: 0, color: '#fffb55' // 0% 处的颜色
                      }, {
                        offset: 1, color: '#fcae61' // 100% 处的颜色
                      }],
                      global: false // 缺省为 false
                    }
                  }
                }
              },
              {
                name: '已完成',
                type: 'bar',
                data: data.map(function (item) {
                  return item.completion;
                }),
                itemStyle: {
                  normal: {
                    //以及在折线图每个日期点顶端显示数字
                    label: {
                      show: false,
                      position: 'top',
                      textStyle: {
                        color: '#76f2f2'
                      },
                      formatter:'{c}'
                    },
                    color: {
                      type: 'linear',
                      x: 0,
                      y: 1,
                      x2: 0,
                      y2: 0,
                      colorStops: [{
                        offset: 0, color: '#76f2f2' // 0% 处的颜色
                      }, {
                        offset: 1, color: '#5873ff' // 100% 处的颜色
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
      //点击地图查询业务数量
      getNumByArea() {
        return axios.get(`${this.$apiList.summary}/business/location`, {
          params: this.locationData
        })
      },
      //获取地图和对应数据
      getMapAndData() {
        this.getMapJson().then(mapRes=>{
          this.getNumByArea().then(valRes=>{
            //事件只注册一次
            if (this.city_mapOption === null) {
              this.$refs['city_mapOption'].registerOnEvent()
              // this.$refs['city_mapOption'].mouseOverEvent()
            }
            this.city_mapOption = {
              visualMap: {
                show: true,//色系条是否显示
                type: 'continuous',
                min: 0,
                max: 4000,//取其区间值就代表色系inRange中的一种颜色
                left: 'left',
                top: 'bottom',
                text: ['多', '少'], // 文本，默认为数值文本
                calculable: false,
                textStyle: {
                  color: '#fff'
                },
                inRange: {
                  symbolSize: 2,
                  color: [
                    "#32C5E9",
                    "#5873ff",
                    "#fffb55",
                    "#fcae61",
                    "#eb5c36",
                    "#f5000b",
                  ],//上色范围
                }
              },
              series: [{
                name: mapRes.data.data.locationName,
                type: 'map',
                map: mapRes.data.data.locationName,
                emphasis: {
                  label: {
                    show: true,
                    color: '#fff'
                  },
                  itemStyle: {
                    areaColor: 'rgba(6,41,100,.85)',
                  }
                },
                // center:['50%','50%'],
                zoom: 1.15,
                roam: true,
                scaleLimit: {
                  min: 1,
                  max: 2,
                },
                // 文本位置修正
                textFixed: {
                  Alaska: [20, -20]
                },
                label: {
                  show: true,
                  color: '#fff'
                },
                itemStyle: {
                  areaColor: '#cdcdcd',
                  borderColor: '#5873ff',
                },
                data: valRes.data.data,
              }]
            }
            this.$refs['city_mapOption'].beginShowMap(mapRes.data.data.locationName, mapRes.data.data.mapJson || {})
          })
        } )
        // axios.all([this.getMapJson(), this.getNumByArea()]).then(
        //   axios.spread((mapRes, valRes) => {
        //
        //   })
        // )
        this.getEventsNumbers()
        this.getDeptRate()
        this.getEventLists()
        this.getAllUserNum()
        this.getAllUserSex()
        this.getBusinessNumByTime()
        this.getBusinessNodeNumByTime()
        this.getUserOnline()
        this.interVal==null?this.getInterval():''
      },
      //获取地图数据
      getMapJson() {
        return axios.get(`${this.$apiList.location}/map/${this.locationData.locationCode}`)
      },
      //获取在线人数统计
      getUserOnline() {
        axios.get(`${this.$apiList.summary}/users/online`, {
          params: this.locationData
        }).then(res => {
          let data = res.data.data
          this.nowOnlineUsers = data.onLine
          this.allPersonNumber = data.total
        })
      },
      //获取任务实时列表
      getEventLists() {
        axios.get(`${this.$apiList.summary}/business/task/details`, {
          params: {
            pageSize: 10,
            pageNum: 1,
            locationCode: this.locationData.locationCode
          },
        }).then(res => {
          let data = res.data.data
          this.newsList = data||[]
        })
      },
      //获取任务事件数字统计
      getEventsNumbers() {
        let data = this._funs.copyObject(this.locationData)
        let time = new Date()
        data.month = time.getMonth()+1
        data.year = time.getFullYear()
        data.day = time.getDate()
        axios.get(`${this.$apiList.summary}/business/count`, {
          params: data
        }).then(res => {
          let data = res.data.data
          this.tweenedAllNumber = data.bussinessCount
          this.workingNumber = data.businessProcessingCount
          this.finisedNumber = data.businessEndCount
        })
      },
      //获取左一相关数据
      getDeptRate() {
        axios.get(`${this.$apiList.summary}/business/task/dept/rate`, {
          params: this.locationData
        }).then(res => {
          const data = res.data.data
          this.rateList = data||[]
          let options = {
            title: {
              left: 3,
              top:5,
              text: '',
              textStyle: {
                fontSize: '12',
              },
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            // legend: {
            //   data: ['处理中', '完成率'],
            //   itemHeight: 6.5,
            //   itemWidth:11,
            //   textStyle: {
            //     color: ["#fffb55", "#5873ff"]
            //   },
            //   top: 6,
            //   left:'50%',
            //   itemGap: 5,
            //   selectedMode: true,//图例选择模式
            // },
            series: [
                {
                name: '正在处理中',
                type: 'pie',
                clockWise: false,
                selectedOffset: 1,
                radius: ['60%', '70%'],
                avoidLabelOverlap: false,
                hoverAnimation: false,
                label: {
                  normal: {
                    show: false,
                    position: 'center',
                    labelLine: {show: false},
                    formatter: function(val){
                      return `{b|处理中}\n{d|${val.value}%}`
                    },
                    rich:{
                      b:{
                        fontSize:12,
                        color:'#0EE5F8'
                      },
                      d:{
                        fontSize:18,
                        fontWeight:600
                      }
                    }
                  },
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '12',
                  },
                  formatter: '{b}:{d}%'
                },
                data: [],
                center:['50%','60%']
                },
              {
                name: '完成率',
                type: 'pie',
                clockWise: false,
                selectedOffset: 1,
                radius: ['45.5%', '58.5%'],
                avoidLabelOverlap: false,
                hoverAnimation: false,
                label: {
                  normal: {
                    show: true,
                    position: 'center',
                    labelLine: {show: false},
                    formatter: function(val){
                      return `{b|完成率}\n{d|${val.value}%}`
                    },
                    rich:{
                      b:{
                        fontSize:12,
                        color:'#0EE5F8'
                      },
                      d:{
                        fontSize:18,
                        fontWeight:600
                      }
                    }
                  },
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '12',
                  },
                  formatter: '{b}:{d}%'
                },
                data: [],
                center:['50%','60%']
              }
            ]
          }
          data.forEach((item, index) => {
            this[`event_pieOption${index + 1}`] = this._funs.copyObject(options)
            this[`event_pieOption${index + 1}`].title.text = item.deptName
            this[`event_pieOption${index + 1}`].radius = [200 - index * 20, 220 - index * 20],
              this[`event_pieOption${index + 1}`].series[0].data = [
                {
                  name: '处理中',
                  value: item.processing,
                  itemStyle: {
                    color: "#5873ff"
                  },
                },
                {
                  name: '完成率',
                  value: item.completion,
                  itemStyle: {
                    color: "transparent"
                  },
                }
              ]
              this[`event_pieOption${index + 1}`].series[1].data = [
              {
                name: '完成率',
                value: item.completion,
                itemStyle: {
                  color: "#fffb55"
                },
              },
              {
                name: '处理中',
                value: item.processing,
                itemStyle: {
                  color: "transparent"
                },
              },
            ]
              this.$refs[`event_pieOption${index + 1}`].mouseOverEvent()
              this.$refs[`event_pieOption${index + 1}`].chooseVuale('highlight',1,0)
          })
        })
      },
      //点击地图回调
      clickEvent(val) {
        this.clearInterVal()
        if (val.data) {
          this.locationData = this.copyClickMapData(val.data)
          const arr = this.tabTitleArr
          //匹配数据添到面包屑数据中
          let isInside = false
          for (let i in arr) {
            if (arr[i].locationLevel != this.locationData.locationLevel) {
              isInside = true
            } else {
              isInside = false
              break;
            }
          }
          //把标题相关加进去
          isInside ? arr.push(this.locationData) : ''
          this.getMapAndData()
        }
      },
      //点击title切换数据
      changeTabTitle(val) {
        this.clearInterVal()
        if (this.locationData.locationLevel != val.locationLevel) {
          this.locationData = val
          const arr = this.tabTitleArr
          for (let i in arr) {
            if (arr[i].locationLevel == this.locationData.locationLevel) {
              let num = parseInt(i) + 1;
              arr.splice(num, arr.length - num)
              break;
            }
          }
          this.getMapAndData()
        }
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
  $fontColor: #0EE5F8;
  .index {
    position: relative;
    background-image: url("../assets/img/indebackgimg.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center;
    padding-top: 30px;
    .full {
      position: absolute;
      right: 25px;
      top: 15px;
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
      top: 0;
      left: 0;
      text-align: center;
      font-size: 30px;
      height: 72px;
      width: 100%;
      color: $white;
      background-image: url("../assets/img/titlepng.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-position: bottom;
      .title {
        margin-top: 10px;
        color: $fontColor;
        font-size: 33px;
        letter-spacing: 5px;
        font-weight: 500;
      }
    }
    .content {
      height: 100%;
      width: 100%;
      .title {
        color: $fontColor;
        line-height: 30px;
        text-align: center;
        margin: 5px auto;
        /*background-color: $borderBackColor;*/
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
      &-right {
        height: 100%;
        & /deep/ .el-scrollbar__wrap {
          overflow-x: hidden;
        }
      }
    }

    .left {
      height: 100%;
      margin-left: 1%;
      border-radius: 8px;
      &-top {
        height: 34.5%;
        margin-top: 14px;
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
        padding-bottom: 10px;
        position: relative;
        &-bread {
          position: absolute;
          top: 12%;
          left: 10px;
          z-index: 10;
          li {
            height: 24px;
            color: $fontColor;
            font-size: 18px;
            font-weight: bold;
            font-family: 'Avenir', Helvetica, Arial, sans-serif;
            cursor: pointer;
            margin-bottom: 3px;
            padding-right: 20px;
            transition: all 0.15s ease-in-out;
            background-image: none;
          }
          li:hover {
            background-image: url("../assets/img/clickHand.png");
            background-repeat: no-repeat;
            background-position: right;
            background-size: contain;
          }
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
      padding-top: 3%;
      &-top {
        display: inline-block;
        width: 100%;
        height: 53%;
        vertical-align: middle;
        position: relative;
        .box-con {
          background-color: rgba(6, 41, 100, 0.85);
          height: 100%;
          background-image: url("../assets/img/firemhon.png");
          background-repeat: no-repeat;
          background-position: 50% 100%;
          background-size: 90%;
          position: relative;
        }
        .numCount {
          position: absolute;
          top: 9%;
          width: 100%;
          li {
            display: inline-block;
            vertical-align: middle;
            width: 48%;
            text-align: center;
          }
          li:nth-last-child(1) {
            display: block;
            width: 100%;
            margin-top: 15px;
          }
          &-text {
            color: $fontColor;
            font-size: 16px;
            text-align: right;
            margin-top: 6px;
          }
          &-num {
            color: #FFD500;
            font-weight: bold;
            font-size: 30px;
          }
        }
      }
      &-bottom {
        height: 40.5%;
        margin-top: 14px;
        .title {
          color: $fontColor;
          line-height: 30px;
          text-align: center;
          margin: 5px auto;
          width: 100%;
          position: relative;
          img {
            position: absolute;
            width: 33px;
            height: 33px;
          }
          img:nth-child(1) {
            top: -3px;
            left: 70px;
          }
        }
        .newList {
          background-color: rgba(6, 41, 100, 0.85);
          li {
            padding: 12px 8px;
            border-bottom: solid 1px #0D327A;
          }
          &-index {
            display: inline-block;
            vertical-align: middle;
            padding: 8px 10px;
            text-align: center;
            background-color: #0D327A;
            p {
              color: $fontColor;
              font-size: 14px;
              font-weight: bold;
            }
          }
          &-content {
            display: inline-block;
            vertical-align: middle;
            margin-left: 1%;
            width: 79%;
            p, span {
              color: $fontColor;
              font-size: 12px;
            }
            &-title {
              color: $fontColor;
              font-size: 12px;
              @include text-over(1)
            }
            &-bottom {
              overflow: hidden;
              div {
                float: left;
                @include text-over(1);
                color: $fontColor;
              }
              div:nth-child(1) {
                width: 42%;
              }
              div:nth-child(2) {
                width: 79%;
              }
            }
            .status {
              color: #fffb55;
            }
          }
        }
      }
    }
    .noInfo {
      height: 100%;
      width: 100%;
      color: $fontColor;
      text-align: center;
      padding-top: 35px;
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
