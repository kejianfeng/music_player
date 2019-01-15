<template>
  <div class="player" v-show="playList.length > 0">
      <!-- 全屏播放 -->
      <transition name='normal'>
        <div class="normal-player" v-show="fullScreen">
              <div class="background">
                <!-- 播放背景 -->
                <img width="100%" height="100%" :src="currentSong.image">
              </div>
              <div class="top">
                <div class="back" @click="mini">
                  <i class="icon-back"></i>
                </div>
                <h1 class="title" v-html='currentSong.name'></h1>
                <h2 class="subtitle" v-html='currentSong.singer'></h2>
              </div>
              <div class="middle" @touchstart.prevent="touchStart" @touchmove.prevent="touchMove" @touchend.prevent="touchEnd">
                <div class="middle-l" ref="cdbackground">
                  <div class="cd-wrapper">
                    <div class="cd"  :class="rotateClass">
                      <img class="image" :src="currentSong.image">
                    </div>
                  </div>
                  <div class="playing-lyric-wrapper">
                    <div class="playing-lyric">{{currentPlayingLyric}}</div>
                  </div>
                </div>
                <scroll class="middle-r" ref="lyricList">
                  <div class="lyric-wrapper">
                    <div>
                      <p class="text " :class="{'current':currentLineNum ===index}" ref="lyricLine" v-for="(line, index) in currentLyric.lines">{{line.txt}}</p>
                    </div>
                  </div>
                </scroll>
              </div>
            <!-- 全屏状态下的底部按钮 -->
              <div class="bottom">
                <div class="dot-wrapper">
                  <span class="dot" :class="{'active': currentShow === 'CD'}"></span>
                  <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
                </div>
                <div class="progress-wrapper">
                  <span class="time time-l">{{ fixTime(currentTime) }}</span>
                  <div class="progress-bar-wrapper">
                    <progress-bar :percentage="percentage" @changePercent="toChangePercent"></progress-bar>
                  </div>
                  <span class="time time-r">{{fixTime(currentSong.duration)}}</span>
                </div>
                <div class="operators">
                  <div class="icon i-left" @click="changeMode">
                    <i :class="iconMode"></i>
                  </div>
                  <div class="icon i-left">
                    <i class="icon-prev" @click="pre_song"></i>
                  </div>
                  <div class="icon i-center" @click="toggle_play">
                    <i :class="iconplay"></i>
                  </div>
                  <div class="icon i-right">
                    <i class="icon-next" @click="next_song"></i>
                  </div>
                  <div class="icon i-right">
                    <i class="icon icon-not-favorite"></i>
                  </div>
                </div>
              </div>
        </div>
      </transition>

      <!-- mini播放 -->
      <transition name="mini">
        <div class="mini-player" v-show="!fullScreen" @click="_fullScreen">
              <div class="icon">
                <img  width="40" height="40" :src="currentSong.image" :class="rotateClass">
              </div>
              <div class="text">
                <h2 class="name" v-html='currentSong.name'></h2>
                <p class="desc"  v-html='currentSong.singer'></p>
              </div>
              <div class="control" @click.stop="mini_toggle_play_">
                <i :class="miniIconplay"></i>
              </div>
              <div class="control">
                <i class="icon-playlist"></i>
              </div>
        </div>
      </transition>
      <audio :src="currentSong.url" ref="playsongs" @timeupdate='CurrentTime' @ended="end"></audio>
  </div>
</template>

<script>
  import ProgressBar from 'base/progress-bar/progress-bar'
  import {playMode} from 'common/js/play_state'
  import LyricParse from 'lyric-parser'
  import scroll from 'base/scroll/scroll';
  
  export default {
    name:'player',
    data() {
      return {
        currentTime:0,
        currentLyric:[],
        currentLineNum: 0,
        currentPlayingLyric:null,
        currentShow:'CD',
      }
    },
    created() {
      this.touch = {}; //记录触摸信息
    },
    computed: {
      iconplay() {
        return this.playState ? 'icon-pause' : 'icon-play'
      },
      miniIconplay() {
        return this.playState ? 'icon-pause-mini' : 'icon-play-mini'
      },
      playState() {
        return this.$store.state.play
      },
      playList() {
        return this.$store.state.playList
      },
      fullScreen() {
        return this.$store.state.fullScreen
      },
      currentSong() {
        return this.$store.state.playList[this.$store.state.currrentIndex]
      },
      rotateClass() {
        return this.playState ? 'play' : 'play pause'
      },
      percentage() {
        return this.currentTime /this.currentSong.duration
      },
      iconMode() {
        return this.$store.state.mode === 0 ? 'icon-sequence' : this.$store.state.mode === 1 ? 'icon-loop' : 'icon-random' 
      }
    },
    methods: {
      touchStart(e) {
        this.touch.symbol = true;
        this.touch.startX = e.touches[0].pageX;
        console.log(this.touch.startX)
        this.touch.startY = e.touches[0].pageY;
      },
      touchMove(e) {
        if(!this.touch.symbol) {
          return 
        }
        let distanceX = e.touches[0].pageX - this.touch.startX;
        let distanceY = e.touches[0].pageY - this.touch.startY;
        if(Math.abs(distanceY) > Math.abs(distanceX)) {
          return 
        }
        let left = (this.currentShow === 'CD') ? 0 : -window.innerWidth   //CD页面左边离视口左边的距离，稳定时只有两个值
        let MoveWidth = Math.min(0,Math.max(left + distanceX, -window.innerWidth)) //cd左边的位置范围在（-window.innnerWidth, 0)
        this.touch.percentage = Math.abs(MoveWidth/(-window.innerWidth));
        this.$refs.cdbackground.style.opacity = 1 - this.touch.percentage;
        this.$refs.lyricList.$el.style['transform'] = `translate3d(${MoveWidth}px,0,0)`
        this.$refs.lyricList.$el.style['transitionDuration'] = 0
      },
      touchEnd(e) {
        let MoveWidth;
        let opacity;
        if( this.currentShow === 'CD') {
            if(this.touch.percentage > 0.1) {
              MoveWidth = -window.innerWidth;
              this.currentShow = 'lyric';
              opacity = 0;
            }
            else {
              MoveWidth = 0;
              opacity = 1;
            }
        }
        else {
          if(this.touch.percentage < 0.9) {
            MoveWidth = 0;
            this.currentShow = 'CD';
            opacity = 1;
          }
          else {
            MoveWidth = -window.innerWidth;
            opacity = 0;
          }
        }
        this.$refs.cdbackground.style.opacity = opacity
        this.$refs.lyricList.$el.style['transform'] = `translate3d(${MoveWidth}px,0,0)`
        this.$refs.lyricList.$el.style['transitionDuration'] = `300ms`
      },
      next_song() {
        if(this.$store.state.mode === playMode.loop ) {
            this.loop()
        }
        else{
          this.$store.commit('_next_song');
          this.currentLyric.stop();
        }
    
      },
      pre_song() {
        if(this.$store.state.mode === playMode.loop ) {
            this.loop()
        }
        else{
          this.$store.commit('_pre_song');
          this.currentLyric.stop();
        }
       
      },
      mini() {
        this.$store.commit('mini_player')
      },
      CurrentTime(e) {
        this.currentTime = e.target.currentTime
      },
      fixTime(smallTime) {  //变换为 00:00 的形式，包含补零功能
      
          let time = smallTime | 0;  //向下取整的简易写法
          let minute = (time / 60) | 0;
          let minutes = minute;
          if(minute < 10) {
            minutes = `0${minute}`
          }
          let second = (time%60) | 0;
          let seconds = second;
          if(second < 10) {
          seconds = `0${second}`
          }
          return `${minutes}:${seconds}`
      },
      _fullScreen() {
        this.$store.commit('fullScreen_')
      },
      toggle_play() {
        this.$store.commit('_toggle_play');
        if(this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      },
      mini_toggle_play_() {
        this.$store.commit('_mini_toggle_play_');
      },
      toChangePercent(percent) {
        let time = percent * this.currentSong.duration;
        this.$refs.playsongs.currentTime = time;
        if(!this.playState) {
          this.$store.commit('_toggle_play')
        }
        if(this.currentLyric) {
          this.currentLyric.seek(time * 1000)
        }
      },
      changeMode() {
        this.$store.commit('toChangeMode')
      },
      end() {
        if(this.$store.state.mode === playMode.loop ) {
            this.loop()
        }
        else  {
          this.next_song()
        }
      },
      loop() {
        this.$refs.playsongs.currentTime = 0;
        this.$refs.playsongs.play()
        if(this.currentLyric) {
          this.currentLyric.seek(0);
        }
      },
      getLyric() {
        this.currentSong.getLyrics().then((res) => {
            this.currentLyric = new LyricParse(res, ({lineNum, txt}) => {
              this.currentLineNum = lineNum;
              console.log( this.currentLineNum)
              this.currentPlayingLyric = txt;
              if( lineNum > 5) {  
                let currentElement = this.$refs.lyricLine;  //注意这是一个数组，如currentElement[0]代表第一行

                this.$refs.lyricList.scrollToElement(currentElement[lineNum - 5], 1000);  //保证开始滚动时高亮的行位于中间行
              }
              else {
                this.$refs.lyricList.scrollToElement(0, 0, 1000);
              }
            })  // lyric-parser这个库的用法
            this.currentLyric.play()
        }).catch(() => {
          this.currentLyric = null;
          this.currentPlayingLyric = null;
          this.currentLineNum = 0;

        })
        
      },
    },
    watch: {
      currentSong() {
         if(this.currentLyric) {
           this.lyricShow = false;
         }
         setTimeout(() => {
            this.$refs.playsongs.play();
            this.getLyric();
         }, 1000)
      },
      playState(now_satte) {
          var audio = this.$refs.playsongs
          now_satte? audio.play():audio.pause()
      }
      // currrentIndex(newIndex) {
      //    this.currentSong = this.playList[newIndex]
      // }
    },
    components: {
      ProgressBar,
      scroll
    }

  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      /* 背景处理 */
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              /* 歌词高亮样式 */
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
            /* 动画效果 */
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        /* 旋转动画 */
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>