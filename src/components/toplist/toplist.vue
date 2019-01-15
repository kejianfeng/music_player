<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script >
  import MusicList from 'components/music-list/music-list'
  import {selectSong} from 'common/js/song'
  import {getTopListDetail}  from 'api/rank'
  export default {
    name:'toplist',
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
      this._getTopListDetail();
    },
    computed: {
      title() {
        return this.$store.state.topList.topTitle
      },
      bgImage() {
        return this.$store.state.topList.picUrl
      }
    },
    methods: {
        _getTopListDetail() {
            if(!this.$store.state.topList.id) {
                this.$router.push('/rank');
                return 
            }
            getTopListDetail(this.$store.state.topList.id).then((res) => {
                this.list = res.songlist;
                this._handleSongs();
            })
        },
        _handleSongs() {
            this.list.forEach((musicData) => {
            // this.songs_list.push(selectSong(item.musicData));
            selectSong(musicData.data).then((response) =>{  //这里res就是返回的值le
            this.songs.push(response);
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