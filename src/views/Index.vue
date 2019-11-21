<template>
  <div>
    <lee-echarts :options="option" :width="width" :height="height"></lee-echarts>
  </div>
</template>

<script>
  const leeEcharts = ()=>import('../components/echarts/index.vue')
  // import 'echarts/map/js/china.js'// 引入中国地图数据
  export default {
    name: "index",
    components: {leeEcharts},
    data() {
      return {
        option:{
          aria: {
            show: true
          },
          title: {
            text: '',
            x: 'center'
          },
          legend:{
            type: 'scroll',
            top:30,
            data:['通山县','公安县','牛栏县','石首市','江陵县']
          },
          series: [
            {
              name: '数据来源',
              type: 'pie',
              data: [
                { value: 335, name: '通山县' },
                { value: 310, name: '公安县' },
                { value: 234, name: '牛栏县' },
                { value: 135, name: '石首市' },
                { value: 548, name: '江陵县' },
              ],
            }
          ]
        },
        width:window.innerWidth-200,
        height:window.innerHeight-60
      }
    },
  }
</script>

<style scoped>

</style>
