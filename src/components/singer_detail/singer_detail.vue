<template>
    <transition name="slide">
            <music-list :songs="songs_list" :title="title":bgImage="bgImage"></music-list>
    </transition>
</template>
<script>
import MusicList from 'components/music-list/music-list'
import {getSingerDetail} from 'api/singer'
import {selectSong} from 'common/js/song'
export default {
  name: 'singer_detail',
  mounted() {
      this._getsinger_detail()
  },
  components:{
        MusicList
  },
  computed: {
    title() {
        return this.$store.state.singer.name
    },
    bgImage() {
        return this.$store.state.singer.face_pic
    }
  },
  data() {
      return {
          songs_list:[],
          list:[],
      }
  },
  methods: {
    _getsinger_detail() {
        if(!this.$store.state.singer.id) {
            this.$router.push('/recommend');
            return 
        }
      //   console.log(this.$store.state.singer.id);
        getSingerDetail(this.$store.state.singer.id).then((res) => {
               this.list = res.data.list;
               this._handleSongs();
               console.log(this.songs_list);
        })
    },
    _handleSongs() {
        this.list.forEach((item) => {
        // this.songs_list.push(selectSong(item.musicData));
        selectSong(item.musicData).then((res) =>{  //这里res就是返回的值le
            this.songs_list.push(res);
        })
    })
    }
  }
  
}
</script>

<style lang="stylus" scoped>
 @import "~common/stylus/variable"
    .singer-detail {
        position: fixed;
        z-index: 100;
        top:0;
        left:0;
        right: 0;
        bottom: 0;
        background: $color-background;
    }

    .slide-enter-active, .slide-leave-active {
        transition: all 0.3s;
    }
    .slide-enter, .slide-leave-to {
        transform: translate3d(100%, 0, 0)
    }
</style>
