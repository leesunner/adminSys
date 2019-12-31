<template>
  <div class="echart" ref="echartContent">
    <div @click="fullScreen" class="full" v-if="!fullscreen">全屏显示</div>
    <div ref="canvas" :style="`height: ${height};width: ${width};`"></div>
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
        height: window.innerHeight + 'px',
        width: '100%',
        echarEle: null,
        fullscreen:false,
      }
    },
    props: ['options'],
    watch: {
      '$store.state.leftControl'(newVal) {
        setTimeout(()=>{
          this.canvas.resize();
        },5)
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.echarEle = this.$refs.echartContent
        window.onresize = (e) => {
          // this.height = this.echarEle.clientHeight+'px'
          // this.width = this.echarEle.clientWidth+'px'
          this.canvas.resize();
        }
        this.endFullScreen()
        //注入自定义主题
        $e.registerTheme('chalk', theme)
        this.init()
        this.setOption()
      })
    },
    methods: {
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
      },
      setOption() {
        this.canvas.setOption(this.options)
      },
      //开始全屏
      fullScreen() {
        const docElm = this.$refs['echartContent'];
        //W3C
        if (docElm.requestFullscreen) {
          docElm.requestFullscreen();
        }

        //FireFox
        else if (docElm.mozRequestFullScreen) {
          docElm.mozRequestFullScreen();
        }
        //Chrome等
        else if (docElm.webkitRequestFullScreen) {
          docElm.webkitRequestFullScreen();
        }
        //IE11
        else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        }
        this.fullscreen = true
      },

      //退出全屏
      endFullScreen() {
        document.addEventListener("fullscreenchange", () =>{
          this.fullscreen = false
        }, false);
        document.addEventListener("mozfullscreenchange", () =>{
          this.fullscreen = false
        }, false);

        document.addEventListener("webkitfullscreenchange", () =>{
          this.fullscreen = false
        }, false);

        document.addEventListener("msfullscreenchange", () => {
          this.fullscreen = false
        }, false);
      }
    }
  }
</script>
<style lang="scss" scoped>
  .echart {
    /*height: 100%;*/
    position: relative;
    width: 100%;
    .full{
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      margin-left: 6%;
      z-index: 300;
      width: 100px;
      color: #ffffff;
      height: 36px;
      line-height: 36px;
      text-align: center;
      cursor: pointer;
      background-color: rgba(0,0,0,0.35);
    }
  }
</style>
