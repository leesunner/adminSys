<template>
  <div>
    <div class="datareport">
      <div class="datareport_tab dereport_flex">
        <div :class="index==selectTab?'active':'datareport_tab_item'" v-for="(item,index) in tablist"
             @click="chooseTab(index)" :style="'width:'+(100/tablist.length)+'%;'">
          {{item}}
        </div>
      </div>
      <div class="pie_item">
        <div class="datareport_num dereport_flex">
          <div class="datareport_num_item">
            <div>已办结</div>
            <div>
              <p class="c_blue vert_bot">{{workFlowNum.done}}</p>
              <p class="vert_bot">件</p>
            </div>
          </div>
          <div class="datareport_num_item">
            <div>未办结</div>
            <div>
              <p class="c_yellow vert_bot">{{workFlowNum.notDone}}</p>
              <p class="vert_bot">件</p>
            </div>
          </div>
          <div class="datareport_num_item">
            <div>逾期已办结</div>
            <div>
              <p class="c_blueg vert_bot">{{workFlowNum.overdueDone}}</p>
              <p class="vert_bot">件</p>
            </div>
          </div>
          <div class="datareport_num_item">
            <div>逾期未办结</div>
            <div>
              <p class="c_yellowg vert_bot">{{workFlowNum.overdueNotDone}}</p>
              <p class="vert_bot">件</p>
            </div>
          </div>
        </div>
        <div class="data_r">
          <lee-echarts :options="events_options" ref="events_options" backGroundColor="transparent">
          </lee-echarts>
        </div>
        <div class="tips_pie">提示：图形显示了我的业务办理情况发布</div>
      </div>
      <div class="pie_item">
        <div class="datareport_tab dereport_flex">
          <div :class="index==selectTabWorkNum?'active':'datareport_tab_item'" v-for="(item,index) in WorkNumTab"
               @click="chooseWorkNumTab(index)" :style="'width:'+(100/WorkNumTab.length)+'%;'">
            {{item}}
          </div>
        </div>
        <div class="data_r">
          <div class="allWorkNum_title">
            <p>总事项数量: </p>
            <p class="c_yellowg">{{allWorkNum.cwCount+allWorkNum.dwCount+allWorkNum.swCount}}</p>
            <p>件</p>
          </div>
          <lee-echarts :options="allEvents_options" ref="allEvents_options" backGroundColor="transparent"></lee-echarts>
        </div>
        <div class="tips_pie">提示：图形显示了我参与的，所有业务属类发布</div>
      </div>
      <div class="top_five">
        <img class="jt" src="../../assets/img/jtdbx7@2x.png"/>
        <p>我的热门业务 TOP5 排行榜</p>
      </div>
      <div class="pie_item">
        <div v-for="(item,index) in topfivePie.businessName" class="pie_item_label">
          <div :class="'pie_item_label_index colorindex'+index">{{'0'+(index+1)}}</div>
          <p>{{item}}</p>
        </div>
        <div class="data_r">
          <lee-echarts :options="topFives_options" ref="topFives_options" backGroundColor="transparent"></lee-echarts>
        </div>
        <div class="tips_pie">提示：图形显示了我发起的，并已办理完的所有业务发布</div>
      </div>
      <div class="tips">本数据最终解释权归《百问数字政务数据中心》所有</div>
    </div>
  </div>
</template>

<script>
  import leeEcharts from '@/components/echarts/index.vue';
  export default {
    name: "my-data-reports",
    components: {leeEcharts},
    data() {
      return {
        selectTab: 0,
        selectTabWorkNum: 0,
        // tabel_th_list:['ip','登录时间','在线时长'],
        workFlowNum: {},
        worksFisList: [],
        allWorkNum: {},//总事项项目
        allWorkNumList: [],
        allWorkNumListColors: ['#9785F1', '#FF9F7F', '#FD7B95'],
        allWorkNumListTab2: [],
        topFivelist: [],
        topfivePie: {},
        topFiveColor: ['#9785F1', '#E0E0E0'],
        list: [],
        timer: 'day',//day 当天  month 当月  week 本周  year 当年
        tablist: ['当天', '当月', '当年', '本周'],
        WorkNumTab: ['事项分布', '事项办理分布'],
        topFives_options: null,
        events_options:null,
        allEvents_options:null,
      }
    },
    created() {
      this.getReportData();
      this.allWorksNum();
      this.getTopFive();
    },
    mounted(){
      this.$nextTick(()=>{
        //窗口变动监听
        window.onresize = (e) => {
          this.$refs['topFives_options']?this.$refs['topFives_options'].resize():'';
          this.$refs['events_options']?this.$refs['events_options'].resize():'';
          this.$refs['allEvents_options']?this.$refs['allEvents_options'].resize():'';
        }
      })
    },
    methods: {
      chooseTab: function (index) {
        this.selectTab = index;
        this.timer = index == 0 ? 'day' : index == 1 ? 'month' : index == 2 ? 'year' : 'week';
        this.getReportData();
        this.allWorksNum();
        this.getTopFive();
      },
      chooseWorkNumTab: function (index) {
        this.selectTabWorkNum = index
        this.allEvents_options = this.setOption(this.selectTabWorkNum==0?this.allWorkNumList:this.allWorkNumListTab2,this.allWorkNumListColors)
      },
      //查询top5事件
      getTopFive: function () {
        this.$request.get(this.$apiList.userHotTopFive + this.timer).then(
          res => {
            res = res.data.data
            if (res) {
              let list = []
              Object.keys(res).forEach(name => {
                let obj = {}
                if (name == 'processing') {
                  obj.name = '未办结';
                  obj.value = res[name]
                }
                if (name == 'done') {
                  obj.name = '已办结';
                  obj.value = res[name]
                }
                if (obj.name) {
                  list.unshift(obj)
                }
              })
              this.topfivePie = res
              this.topFivelist = list
              this.topFives_options = this.setOption(list,this.topFiveColor,false)
            }
          }
        )
      },
      //将对象处理称pie图需要的数据
      dataToArr: function (res) {
        let list = []
        Object.keys(res).forEach(name => {
          let obj = {}
          if (name == 'overdueDone') {
            obj.name = '逾期已办';
            obj.value = res[name]
          }
          if (name == 'overdueNotDone') {
            obj.name = '逾期未办';
            obj.value = res[name]
          }
          if (name == 'done') {
            obj.name = '已办结';
            obj.value = res[name]
          }
          if (name == 'notDone') {
            obj.name = '未办结';
            obj.value = res[name]
          }
          if (obj.name) {
            list.unshift(obj)
          }
        })
        return list
      },
      //查询办事分类（已办，未办，逾期等）数据分析
      getReportData: function () {
        this.$request.get(this.$apiList.userWorkFlowNum + this.timer).then(
          res => {
            res = res.data.data
            if (res) {
              let list = this.dataToArr(res)
              this.workFlowNum = res
              this.worksFisList = list
              this.events_options = this.setOption(this.worksFisList)
            }
          })
      },
      //总事项项目
      allWorksNum: function () {
        this.$request.get(this.$apiList.allWorksNum + this.timer).then(
          res => {
            res = res.data.data
            if (res) {
              let list = [], list2 = [];
              Object.keys(res).forEach(name => {
                let obj = {}
                if (name == 'dwCount') {
                  obj.name = '党务';
                  obj.value = res[name]
                  list2.unshift(obj)
                }
                if (name == 'swCount') {
                  obj.name = '事务';
                  obj.value = res[name]
                  list2.unshift(obj)
                }
                if (name == 'cwCount') {
                  obj.name = '财务';
                  obj.value = res[name]
                  list2.unshift(obj)
                }
                if (name == 'dwDoneCount') {
                  obj.name = '党务';
                  obj.value = res[name]
                  list.unshift(obj)
                }
                if (name == 'swDoneCount') {
                  obj.name = '事务';
                  obj.value = res[name]
                  list.unshift(obj)
                }
                if (name == 'cwDoneCount') {
                  obj.name = '财务';
                  obj.value = res[name]
                  list.unshift(obj)
                }
              })
              this.allWorkNum = res
              this.allWorkNumList = list
              this.allWorkNumListTab2 = list2
              this.chooseWorkNumTab(0)
            }
          })
      },
      setOption: function(
        data,
        colors = ["#37A2DA","#FFAA00", "#32C5E9", "#fa7193","#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
        lengendShow=true) {
        let legend = null;
        if(lengendShow){
          legend = {
            data: data.map(function (item) {
              return item.name
            }),
            itemWidth: 16.5,
            itemHeight: 10,
            bottom: 0,
          }
        }
        const option = {
          color: colors,
          legend: legend,
          tooltip:{
            formatter:'占比:{d}%',
            trigger: 'item',
          },
          series: [{
            name: '',
            label: {
              normal: {
                fontSize: 12,
                formatter:'{b}:{c}件 \n{d}%'
              }
            },
            type: 'pie',
            center: ['50%', '50%'],
            radius: ['45%', '65%'],
            itemStyle:{
              borderWidth:5,
              borderColor:'#ffffff'
            },
            labelLine: {
              show:true,
              normal: {
                length: 10,
                length2: 3,
              }
            },
            data: data
          }]
        };
        if(!lengendShow){
          //设置内环的大小和位置
          option.series.push({
            type: 'pie',
            hoverAnimation: false, //鼠标移入变大
            center: ['50%', '50%'],
            radius: ['43%', '46%'],
            labelLine: {
              show:false,
            },
            data: [
              {
                value:100,
                itemStyle: {
                  normal: {
                    color: '#07B4EF'
                  }
                }
              }
            ]
          })
        }
        return option
      }
    }
  }
</script>

<style lang="scss" scoped>
  .datareport {
    background-color: #ffffff;
    height: 100%;
    margin: 0 auto;
    padding:0 28.5px 28.5px 28.5px;
    position: relative;
    p {
      display: inline-block;
      vertical-align: middle;
    }
  }

  .datareport_tab {
    height: 30px;
    border: solid 1px #0099F7;
  }

  .dereport_flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-flow: nowrap row;
  }

  .datareport_tab_item {
    font-size: 12px;
    text-align: center;
    height: inherit;
    line-height: 30px;
    color: #666666;
    border-left: solid 1px #0099F7;
    &:hover {
      cursor: pointer;
    }
  }

  .datareport_tab_item:nth-child(1) {
    border-left: none;
  }

  .active {
    background-color: #0099F7;
    color: #ffffff;
    font-size: 12px;
    text-align: center;
    height: inherit;
    line-height: 30px;
  }

  .pie_item {
    padding: 36.5px 17px 17px 17px;
    box-shadow: 0 0 7.5px 0.5px rgba(10, 16, 20, .12);
    margin-top: 27.5px;
  }

  .datareport_num {
    height: 86.5px;
    border-top: solid 1px #E0E0E0;
    border-bottom: solid 1px #E0E0E0;
  }

  .datareport_num_item {
    width: 33.333333333333%;
  }

  .datareport_num_item:nth-child(2) {
    border-left: solid 1px #E0E0E0;
    border-right: solid 1px #E0E0E0;
  }

  .datareport_num_item:nth-child(3) {
    border-right: solid 1px #E0E0E0;
  }

  .datareport_num_item div {
    height: 43px;
    line-height: 43px;
    color: #666666;
    font-size: 12px;
    text-align: center;
  }

  .datareport_num_item .c_blue, .c_yellow, .c_blueg, .c_yellowg {
    font-size: 18px;
    text-align: center;
    margin-right: 2px;
  }

  .c_blue {
    color: #047AEB;
  }

  .c_yellow {
    color: #FFAA00;
  }

  .c_blueg {
    color: #07B4EF;
  }

  .c_yellowg {
    color: #FF9F7F;
  }

  .top_five {
    margin-top: 47.5px;
    margin-bottom: 25.5px;
    padding-left: 15px;
  }

  .top_five img {
    display: inline-block;
    width: 13.5px;
    height: 15.5px;
    vertical-align: middle;
  }

  .top_five p {
    color: #E42419;
    font-size: 18px;
    vertical-align: middle;
    margin-left: 18px;
  }

  .pie_item_label {
    height: 59px;
    border-bottom: solid 1px #E0E0E0;
    padding: 11px 12px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-flow: nowrap row;
  }

  .pie_item_label p {
    font-size: 12px;
    color: #666666;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .pie_item_label_index {
    width: 36px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    background-color: #F2F2F2;
    margin-right: 43px;
    font-size: 18px;
    position: relative;
  }

  .pie_item_label_index::after {
    content: '';
    display: block;
    position: absolute;
    border-left: solid 10px #F2F2F2;
    border-top: solid 10px transparent;
    border-bottom: solid 10px transparent;
    width: 0;
    height: 0;
    right: -27px;
    top: 10px;
  }

  .colorindex0 {
    color: #E42419;
  }

  .colorindex1 {
    color: #FFAA00;
  }

  .colorindex2 {
    color: #07B4EF;
  }

  .colorindex3 {
    color: #9785F1;
  }

  .colorindex4 {
    color: #FF9F7F;
  }

  .data_r {
    padding-top: 15px;
    overflow: hidden;
    padding-bottom: 15px;
    height: 350px;
  }

  .tips_pie {
    color: #969696;
    font-size: 12px;
    text-align: center;
    margin-top: 5px;
  }

  .tips {
    color: #666666;
    font-size: 12px;
    margin-top: 35px;
    text-align: center;
  }

  .vert_bot {
    vertical-align: bottom;
  }

  .allWorkNum_title {
    font-size: 15px;
    color: #666666;
  }
</style>
