<template>
  <div class="music-list">
    <div class="back">
      <i class="icon-back" @click="goBack"></i>
    </div>
    <h1 class="title" >{{title}}</h1>
    <div class="bg-image" :style="bgStyle" ref="bgTop">
      <div class="play-wrapper" v-show="songs.length" ref="paly_button" @click="playAll">
        <div class="play">
          <i class="icon-play"></i>
          <span class="text">播放全部</span>
        </div>
      </div>
      <div class="filter">
      </div>
    </div>
    <div class="layer" ref="layer" ></div>
    <scroll class="scroll" ref="list" :probe-type="3"
    :listen-scroll="true" @scroll="scrollList">
      <div class="song-list-wrapper">
        <song-list :songs="songs"></song-list>
      </div>
      <div class="loading-container" v-show = "!songs.length" >
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script >
  import scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import loading from 'base/loading/loading'
  export default {
    name:"music-list",
    props:{
      title:{
        type:String
      },
      bgImage: {
        type:String
      },
      songs:{
        type:Array
      }
    },
    data() {
      return {
        scrollY: 0 //记录滚动
      }
    },
    created() {
      this.probeType = 3
      this.listenScroll = true
    },
    mounted() {
      this.clientHeight = this.$refs.bgTop.clientHeight;
      this.$refs.list.$el.style.top = `${this.clientHeight}px`
    },
    components: {
      SongList,
      scroll,
      loading
    },
    methods:{
      scrollList(e) {  //e为滚动事件的参数
        this.scrollY = e.y  //better的内置参数属性,有x 与y ,y为当前该元素离父元素的顶部距离
        // console.log(e)
      },
      goBack() {
        this.$router.back()
      },
      playAll() {
        this.$store.commit('toPlayAll', this.songs)
      }
    },
    computed: {
      bgStyle() {
        return `background-image:url(${this.bgImage})`
      }
    },
    watch:{
      scrollY(newY) {  //newY为改变后scrollY的值
        // console.log(newY)
        let zIndex = 0;
        let scale = 1;
        var  minY = this.clientHeight
        this.$refs.layer.style['transform'] = `translate3d(0, ${newY}px, 0)`  // y轴向下为正，向上为负
        if(newY > 0) {
          zIndex = 10
          scale = 1 + Math.abs(newY/this.clientHeight);
          this.$refs.bgTop.style['transform'] = `scale(${scale})`  //因为在图片块的属性设置了transform-origin: top，则变形会以顶部为原点
        }
        if(newY > -( minY-40)) {
          this.$refs.paly_button.style.display = 'block';
          this.$refs.bgTop.style.paddingTop ='70%';
          this.$refs.bgTop.style.height = 0;
        }
        else {
          zIndex=10;
          this.$refs.paly_button.style.display = 'none';
          this.$refs.bgTop.style.paddingTop = 0;
          this.$refs.bgTop.style.height = '40px'
        }
        this.$refs.bgTop.style.zIndex = zIndex
      }
    }
  }

  
</script>

<style scoped lang="stylus">
    @import "~common/stylus/variable";
  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index:50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .layer
      position: relative
      height: 100%
      background: $color-background
    .scroll
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>