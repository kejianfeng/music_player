<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box  ref="searchBox" @queryNow="getQuery"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <scroll class="shortcut" :data="refresh">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul >
                <li class="item" v-for='item in hotKey' @click="addToQuery(item.k)">
                  <span>{{item.k}}</span>
                </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="_clearAll">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list :history="searchHistory" @deleSingle="_toDeleteSingle"></search-list>
          </div>
          </div>
        </scroll>
    </div>
    <div class="search-result" v-show="query">
      <suggest :query="query" @beforeScroll="fadeInput"></suggest>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  import SearchBox from 'base/search-box/search-box'
  import {getHotSrarchList} from 'api/hotSearch' 
  import suggest from 'components/suggest/suggest'
  import SearchList from 'base/search-list/search-list'
  import Scroll from 'base/scroll/scroll'

  export default {
    name:'search',
    components: {
      SearchBox,
      suggest,
      SearchList,
      Scroll
    },
    computed: {
      searchHistory() {
        return this.$store.state.searchHistory
      },
      refresh() {
        return this.hotKey.concat(this.searchHistory)  //热搜与关键词任一发生变化都去重新计算要滚动的高度
      }
    },
    data() {
      return {
        hotKey:[],
        query:''
      }
    },
    created() {
      this._getHotSrarchList()
    },
    methods: {
      _getHotSrarchList() {
        getHotSrarchList().then((res) => {
          if(res.code === 0) {
           let hotKey_1 = res.data.hotkey
            hotKey_1.splice(10)  //取前十条热搜
            this.hotKey = hotKey_1
          }
        })
      },
      addToQuery(query) {
        this.$refs.searchBox.addHotQuery(query)
      },
      getQuery(newQuery) {
        this.query = newQuery
      },
      fadeInput() {
        this.$refs.searchBox.blurInput()
      },
      _toDeleteSingle(index) {
        this.$store.commit('toDeleteSingle', index)
      },
      _clearAll() {
        this.$store.commit('clearAll')
      }
    }

  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>