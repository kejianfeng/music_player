<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input class="box" :placeholder="placeholder" v-model="query"/>
    <i class="icon-dismiss" v-show="query" @click="clear"></i>
  </div>
</template>

<script>
  
  export default {
    name:'search-box',
    props:{
      placeholder: {
        type:String,
        default:"搜索歌曲、歌手"
      },
      hotQuery: {
        type:String,
        default:''
      }
    },
    data() {
      return {
        query:''
      }
    },
    methods: {
      clear() {
        this.query = ''
      },
      addHotQuery(query) {
        this.query = query
      }
    },
    watch: {
      query(newQuery) {
          this.$emit('queryNow',newQuery)
      }
    }
 
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>