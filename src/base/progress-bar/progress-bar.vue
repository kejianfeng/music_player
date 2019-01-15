<template>
  <div class="progress-bar" ref="progressBar" @click="jumpTo">
    <div class="bar-inner">
      <div class="progress" ref="progressColor"></div>
      <div class="progress-btn-wrapper" ref="progressBtn" @touchstart.prevent="touchStart" @touchmove.prevent="touchMove" @touchend.prevent="touchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
  const dotWidth = 16    //小圆点宽度
  export default {
    name:'progress-bar',
    props: {
      percentage: {
        type:Number,
        default: 0
      }
    },
    created() {
      this.touchObject = {}
    },
    methods: {
      touchStart(e) {
        this.touchObject.touchSymbol = true;
        this.touchObject.startX = e.touches[0].pageX;  //这里直接是e.touches[0]，e便是这次的touch事件，[0]是说第一手指
        this.touchObject.startLeft = this.$refs.progressColor.clientWidth;
      },
      touchMove(e) {
        // console.log(555555)
        if(!this.touchObject.touchSymbol) {  //当没有触发touch事件时直接return
          return 
        }
        else {
          let distance = e.touches[0].pageX - this.touchObject.startX;
          let newWidth = Math.min(this.$refs.progressBar.clientWidth - dotWidth,Math.max(0,this.touchObject.startLeft + distance))
          this.toChangeWidth(newWidth);
        }
      },
      touchEnd() {
        this.touchObject.touchSymbol = false;
        this.emitChange()
      },
      toChangeWidth(newWidth) {
        this.$refs.progressColor.style.width = `${newWidth}px`;
        this.$refs.progressBtn.style['transform'] = `translate3d(${newWidth}px,0,0)`
      },
      emitChange() {
        let newWidth = this.$refs.progressColor.clientWidth;
        let width = this.$refs.progressBar.clientWidth - dotWidth;
        let percent = newWidth / width
        this.$emit('changePercent', percent)
      },
      jumpTo(e) {
        this.toChangeWidth(e.offsetX);
        this.emitChange();
      }
    },
    watch: {
      percentage(newPercentage) {
        if(!this.touchObject.touchSymbol) {
          var width = this.$refs.progressBar.clientWidth - dotWidth;
          let newWidth = width * newPercentage;
          // console.log(width)
          this.toChangeWidth(newWidth)
        }
        
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>