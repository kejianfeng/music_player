<template>
  <div >
    <list-view :data="singerList" @enter_detail="enterdetail"></list-view>
    <router-view>

    </router-view>
  </div>
</template>

<script>

  // import {getSingerList} from 'api/singer'
  import axios from 'axios'
  import listview from 'base/listview/listview'

export default {
  name: 'singer',
  components:{
    ListView:listview
  },
  data() {
    return {
      singerList:[]
    }
  },
  mounted() {
      this.getSingerList();
      // console.log(666)
  },
  methods:{
      enterdetail(items) {
          this.$router.push({
            path:`/singer/${items.id}`
          })
      },
      getSingerList() {
        // console.log(555)
        axios.get('/static/singer.json').then((res) => {
          var list = res.data.data.list;
          var hot = [];
          var letter = [];
          var singer_total = [];
          var singers = [];
          list.forEach((item, index) => {
              if(index < 10) {
                    hot.push({
                      name:item['Fsinger_name'],
                      id:item['Fsinger_mid'],
                      face_pic:`https://y.gtimg.cn/music/photo_new/T001R300x300M000${item['Fsinger_mid']}.jpg?max_age=2592000`
                    })
              }
              var re = /[A-Z]/
              if(!letter.includes(item['Findex']) && re.test(item['Findex'])) {
                letter.push(item['Findex'])
              }
          });
          letter.sort((a,b ) => {
            if(a > b) {
              return 1
            }
            else return -1
          })
          console.log(letter)
          var i = 0;
          while( i < letter.length) {
              singers[i] = [];
              list.forEach((item) => {
                if(item['Findex'] === letter[i]) {
                    singers[i].push({
                      D:item['Findex'],
                      name:item['Fsinger_name'],
                      id:item['Fsinger_mid'],
                      face_pic:`https://y.gtimg.cn/music/photo_new/T001R300x300M000${item['Fsinger_mid']}.jpg?max_age=2592000`
                    })
                }
              })
              i++
          }
          // console.log(singers)
          singer_total.push({
            title:"热门",
            item:hot
          })
          singers.forEach((items) => {
            // console.log(items[0]["D"])
            singer_total.push({
              title:items[0]["D"],
              item:items
            })
          })
         this.singerList = singer_total
          // this.hotSinger = hot;
          // this.singerList = singers;

      })
      }
  }
}
</script>

<style lang="stylus" scoped>
 
</style>
