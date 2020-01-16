<template>
  <div class="slider" ref="slider" @mousemove.stop="mouseMove">
    <p class="slider-text">{{lock?'已完成验证':'请按住滑块，拖到最右边>>'}}</p>
    <div :class="['slider-color',down?'':'slider-animtc']" :style="`width:${lock?xCache+45:xCache}px`">
    </div>
    <div :class="['slider-item',down?'':'slider-animt']" v-show="!lock" ref="block" @mousedown.stop="mouseDown"
         @mouseup.stop="mouseUp" :style="`transform: translateX(${xCache}px)`">{{text}}
    </div>
  </div>
</template>

<script>
  export default {
    name: "slider",
    props: {
      width: {
        type: Number,
        default: 350
      },
      control: {
        type: Boolean,
        default: true,
      }
    },
    watch: {
      control(newVal) {
        if (!newVal){
          this.moveX = 0
          this.xCache = 0
          this.down = false
          this.lock = false
          this.moveWidth = this.width - 45
          this.text = '滑块'
        }
      },
      lock(newVal){
        this.$emit('change',newVal)
      }
    },
    created() {
      this.$nextTick(() => {
        this.$refs.slider.style.width = `${this.width}px`
      })
    },
    data() {
      return {
        moveX: 0,
        xCache: 0,
        down: false,
        lock: false,
        moveWidth: this.width - 45,
        text: '滑块',
      }
    },
    methods: {
      mouseDown(e) {
        this.down = true
        this.moveX = e.clientX
      },
      mouseUp(e) {
        this.down = false
        this.xCache >= this.moveWidth ? this.xCache = this.moveWidth : this.xCache = 0
      },
      mouseMove(e) {
        if (this.down && !this.lock) {
          let mx = e.clientX - this.moveX
          if (mx >= 0) {
            if (mx < this.moveWidth) {
              this.xCache = mx
            } else {
              this.xCache = this.moveWidth
              this.lock = true
              this.text = ''
            }
          } else {
            this.xCache = 0
          }
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  $w:45px;
  .slider {
    user-select: none;
    width: 100%;
    height: $w;
    background-color: rgba(209, 209, 209, 0.95);
    position: relative;
    margin-top: 15px;
    text-align: center;
    font-size: 14px;
    &-text {
      line-height: $w;
      //animation: sca 1s linear -10s infinite;
      background: -webkit-gradient(linear,left top,right top,color-stop(0,#4d4d4d),color-stop(.4,#4d4d4d),color-stop(.5,#fff),color-stop(.6,#4d4d4d),color-stop(1,#4d4d4d));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: slidetounlock 2s infinite;
      -webkit-text-size-adjust: none;
      position: relative;
      width: 100%;
      z-index: 1;
    }
    @keyframes  slidetounlock{
      from{
        background-position: -200px 0;
      }
      to{
        background-position: 200px 0;
      }
    }
    @keyframes sca {
      0% {
        transform: scale3d(1, 1, 1);
      }
      50% {
        transform: scale3d(1.15, 1.15, 1.15);
      }
      100% {
        transform: scale3d(1, 1, 1);
      }
    }
    &-color {
      position: absolute;
      top: 0;
      left: 0;
      height: $w;
      width: $w;
      line-height: $w;
      background-color: $primary;
      color: $white;
      letter-spacing: 4px;
      opacity: 0.95;
    }
    &-animtc {
      transition: all 0.22s ease-in-out;
    }
    &-item {
      position: absolute;
      top: 0;
      left: 0;
      height: $w;
      width: $w;
      line-height: $w;
      z-index: 10;
      cursor: move;
      background-color: $primary;
      color: $white;
    }
    &-animt {
      transition: all 0.2s ease-in-out;
    }
  }
</style>
