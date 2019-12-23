<template>
  <div class="slider" ref="slider" @mousemove.stop="mouseMove">
    <p class="slider-text">拖动滑块>></p>
    <div :class="['slider-color',down?'':'slider-animtc']" :style="`width:${lock?xCache+45:xCache}px`">
      {{lock?'拖动已完成>>':''}}
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
  .slider {
    user-select: none;
    width: 100%;
    height: 40px;
    background-color: rgba(209, 209, 209, 0.95);
    position: relative;
    margin-top: 15px;
    text-align: center;
    font-size: 14px;
    &-text {
      line-height: 40px;
      animation: sca 1s linear -10s infinite;
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
      height: 40px;
      width: 40px;
      line-height: 40px;
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
      height: 40px;
      width: 40px;
      line-height: 40px;
      cursor: move;
      background-color: $primary;
      color: $white;
    }
    &-animt {
      transition: all 0.2s ease-in-out;
    }
  }
</style>
