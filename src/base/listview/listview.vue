<template>
    
        <scroll class="list-view" :data="data" ref='list_view'>
            <ul>
                <li v-for="group in data" class="list-group" ref='listGgroup'>
                    <h2 class="list-group-title"> {{group.title}} </h2>
                    <ul>
                    <li class="list-group-item" v-for="items in group['item']" @click="change(items), toChangeSinger(items)">
                        <img v-lazy="items.face_pic" alt="" class="avatar">
                        <span class="name"> {{items.name}} </span>
                    </li>
                    </ul>
                </li>
            </ul>
            <div class="list-shortcut" @touchstart="onTouchStart" @touchmove.stop.prevent='onTouchMove'>
                <ul>
                  <li v-for='(item, index) of letter_list' class="item" :data-index="index">
                    {{ item }}
                  </li>
                </ul>
            </div>
        </scroll>

</template>
<script>
  import Scroll from 'base/scroll/scroll'
 import {getData} from 'common/js/dom'
  export default {
   name:'listview',
    props: {
      data: {
        type: Array,
      }
    },
    created() {
      this.touch = {}
    },
    methods:{
      change(items) {
        this.$emit('enter_detail', items)
      },
      toChangeSinger(items) {
        this.$store.commit('changeSinger',items)
      },
      onTouchStart(e) {
          let letter_index = getData(e.target, 'index' );
          this.touch.firstAnchor = letter_index;
          let firstTouch = e.touches[0] //第一个接触点
          this.touch.y1 = firstTouch.pageY  //第一个接触点的距离页面高度
          this.$refs.list_view.scrollToElement(this.$refs.listGgroup[letter_index], 0)
      },
      //触摸移动
      onTouchMove(e) {
        let firstTouch = e.touches[0];
        this.touch.y2 = firstTouch.pageY;
        let distance = Math.floor((this.touch.y2 - this.touch.y1)/18 )  //18是每个字母元素的高度
        // console.log(distance);
        let newAchor = parseInt(this.touch.firstAnchor ) + distance;
        this.$refs.list_view.scrollToElement(this.$refs.listGgroup[newAchor], 0);

      }
    },
    components:{
        Scroll
    },
    computed:{
      letter_list() {
        return this.data.map((item) => {
             return item.title.substr(0, 1)
      } )
      }
    }
  }

</script>
<style lang="stylus">
  @import "~common/stylus/variable"
  .list-view
    position: absolute
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>