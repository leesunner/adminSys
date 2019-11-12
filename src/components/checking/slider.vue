<template>
  <div class="slider" ref="slider" @mousemove.stop="mouseMove">
    <div :class="['slider-color',down?'':'slider-animtc']" :style="`width:${lock?xCache+45:xCache}px`">{{lock?'拖动已完成>>':''}}</div>
    <div :class="['slider-item',down?'':'slider-animt']" v-show="!lock" ref="block" @mousedown.stop="mouseDown"
         @mouseup.stop="mouseUp">{{text}}
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
        text:'滑块',
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
        this.moveSlider()
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
          this.moveSlider()
        }
      },
      moveSlider() {
        this.$refs.block.style.transform = `translateX(${this.xCache}px)`
      },
    }
  }
</script>

<style lang="scss" scoped>
  .slider {
    user-select: none;
    width: 100%;
    height: 45px;
    background-color: rgba(0,0,0,.35);
    position: relative;
    margin-top: 15px;
    &-color{
      position: absolute;
      top: 0;
      left: 0;
      height: 45px;
      background-color: $success;
      color: $white;
      letter-spacing:4px;
      opacity: 0.80;
    }
    &-animtc{
      transition: all 0.22s ease-in-out;
    }
    &-item {
      height: 45px;
      width: 45px;
      cursor: move;
      background-color: $primary;
      color: $white;
    }
    &-animt {
      transition: all 0.2s ease-in-out;
    }
  }
</style>
