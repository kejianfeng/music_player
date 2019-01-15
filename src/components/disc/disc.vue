<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bgImage="bgImage"></music-list>
  </transition>
</template>

<script >
  import MusicList from 'components/music-list/music-list'
  import {selectSong} from 'common/js/song'
  import {getDescListSongs} from 'api/recommend'
  export default {
    name:'disc',
    components: {
      MusicList
    },
    data() {
        return {
          songs:[],
          list:[]
        }
    },
    created() {
      this._getDescListSongs()
    },
    computed: {
      title() {
        return this.$store.state.disc.dissname
      },
      bgImage() {
        return this.$store.state.disc.imgurl
      }
    },
    methods: {
      _getDescListSongs() {
        if(!this.$store.state.disc.dissid) {
          this.$router.push('/recommend')
          return 
        }
        getDescListSongs(this.$store.state.disc.dissid).then((res) => {
          // this.songs = this._createSongs(res.data.cdlist[0].songlist);
          // console.log(this.songs)
          this.list = res.data.cdlist[0].songlist;
          console.log(this.list)

          this._handleSongs();
          // console.log(this.songs_list);
        })
      },
      _handleSongs() {
        this.list.forEach((musicData) => {
        // this.songs_list.push(selectSong(item.musicData));
          selectSong(musicData).then((res) =>{  //这里res就是返回的值le
              this.songs.push(res);
          })
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>