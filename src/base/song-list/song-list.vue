<template>
  <div class="song-list">
    <ul>
      <li v-for="(song,index) in songs" class="item" @click="changePlayer_State(index)">
        <div class="content">
          <h2 class="name">
            {{ song.name }}
          </h2>
          <p class="desc">{{ getDesc(song) }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script >
  export default {
    name:'song-list',
    props:{
      songs:{
        type:Array
      }
    },
    methods:{
      getDesc(song) {
          return `${song.singer}。${song.ablum}`
      },
      changePlayer_State(index) {
        this.$store.commit('changePlayerState', {
          index:index,
          songs:this.songs
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"

  @import "~common/stylus/mixin"

  .item
    display: flex
    align-items: center
    height: 64px
    box-sizing: border-box
    font-size: $font-size-medium-x
    padding-left:2rem
    .rank-order
      flex: 0 0 25px
      width: 25px
      margin-right: 30px
      text-align: center
      .icon
        display: inline-block
        width: 25px
        height: 24px
        background-size: 25px 24px
        &.icon0
          bg-image('first')
        &.icon1
          bg-image('second')
        &.icon2
          bg-image('third')
      .text
        color: $color-theme
        font-size: $font-size-large
    .content
      flex: 1
      line-height: 20px
      overflow: hidden
      .name
        no-wrap()
        color: $color-text
      .desc
        no-wrap()
        margin-top: 4px
        color: $color-text-d
</style>