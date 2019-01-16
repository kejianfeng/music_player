<template>
  <scroll class="suggest" :data="result" @scrollToEnd="loadMore" :pullup="pullup">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in result" @click="enterSingerOrMusic(item)">
        <div class="icon">
          <i :class="getIcon(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html='getName(item)'></p>
        </div>
      </li>
      <loading v-show="hasMore"></loading>
    </ul>
  </scroll>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {search} from 'api/hotSearch' 
  import {filterSinger} from 'common/js/song'
  import loading from 'base/loading/loading'
  import {selectSong} from 'common/js/song'

  const perpage = 20

  export default {
    props: {
      query: {
        type:String,
        default:''
      },
      showSinger:{
        type:Boolean,
        default: true
      }
    },
    
    components: {
      Scroll,
      loading
    },
    data() {
      return {
        page: 1,
        result:[],
        hasMore:true,
        pullup:true
      }
    },
    methods: {
      _search() {
        search(this.query, this.page, this.showSinger,perpage).then((res) => {
            if(res.data.code === 0) {
              var data = res.data.data
              this.result = this.getResult(data);
             this.check(data)
            }
        })
      },
      loadMore() {
        if(!this.hasMore) {
          return
        }
       else{
            this.page ++;
            search(this.query, this.page, this.showSinger,perpage).then((res) => {
              if(res.data.code === 0) {
                var  data = res.data.data
               this.result = this.result.concat(this.getResult(data));
                // console.log(this.result.length)
                this.check(data)
                // console.log(this.result)
            }
        })
        }
      },
      check(data) {
        if(!data.song.list || data.song.curpage * perpage  > data.song.totalnum) { //超过查询总数或没有list
            this.hasMore = false
        }
        else {
          this.hasMore = true
        }
      },
      //独创秘诀
      enterSingerOrMusic(item) {
          if(item.type === 'singer') {
            console.log(item)
            let singer = {
              id:item.singermid,
              name:item.singername,
              face_pic:`https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.singermid}.jpg?max_age=2592000`
            };
            console.log(singer.face_pic)
            this.$router.push({
              path:`/search/${singer.id}`
            })
            this.$store.commit('changeSinger', singer)
          }
          else {
              selectSong(item).then((res) => {
                console.log(11111111)
               let song = res;
               if(this.$store.state.playList.length === 0) { //若播放列表为空
                 this.$store.commit("addSingleSong",song)
               }
               else { //不为空
                 this.$store.commit("addToPlayList",song)
               }
              })
          }

      },
      getIcon(item) {
          if(item.type === 'singer') {
            return 'icon-mine'
          }
          else {
            return 'icon-music'
          }
      },
      getName(item) {
          if(item.type === 'singer') {
              return item.singername
          }
          else {
            return `${item.songname}-${filterSinger(item.singer)}`
          }
      },
      getResult(data) {
        let ret = [];
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: 'singer'}}) //拓展运算符，已做笔记
        } 
        if (data.song) {
          ret = ret.concat(data.song.list)
        }
        return ret
      }

    },
    watch: {
      query() {
        this._search()
      }
    }

   
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>