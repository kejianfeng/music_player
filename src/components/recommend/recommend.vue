<template>
    <div>
        <div class="recommend" ref="wrapper">
                <div  class="recommend-content" >
                        <div  class="slider-wrapper">
                                <swiper :options="swiperOption" v-if="recommend_pic.length>1">
                                    <!-- slides -->
                                    <swiper-slide v-for='item of recommend_pic' :key="item.id">
                                        <a :href="item.linkUrl">
                                                <img :src="item.picUrl" class="swiper-img" @load="refresh_">
                                        </a>
                                    </swiper-slide>
                                    <!-- Optional controls -->
                                    <div class="swiper-pagination"  slot="pagination"></div>   
                                </swiper>
                        </div>
                        <div class="recommend-list">
                            <h1 class="list-title">热门歌单推荐</h1>
                            <ul> 
                                <li class="item" v-for="item in songList" @click="enterSongList(item)">
                                    <div class="icon">
                                        <img  width="60" height="60" v-lazy="item.imgurl">
                                    </div>
                                    <div class="text">
                                        <h2 class="name" v-text='item.dissname'></h2>
                                        <p class="desc" v-text='item.creator.name'></p>
                                    </div>
                                </li>
                                
                            </ul>
                        </div>  
                </div>
                <div class="loading-container" v-show="!songList.length">
                    <loading-gif ></loading-gif>
                </div>
        </div>
    <!-- 二级路由的容器 -->
    <router-view></router-view>
    </div>
</template>

<script>
    import LoadingGif from 'base/loading/loading'
    import {getRecommend,  getDescList} from 'api/recommend'
    import BScroll from 'better-scroll'
    import scroll from 'base/scroll/scroll'

    export default {
        name: "recommend",
        components: {
            scroll,
            LoadingGif

        },
        mounted() {
            this._scroll()
        },
        data() {
            return {
                check:false,
                songList:[],
                recommend_pic:[],
                swiperOption: {
                    pagination: {
                    el: '.swiper-pagination',
                    },
                    loop: true,
                    autoplay:true,
                    // type:"bullets"
                    observer:true,//修改swiper自己或子元素时，自动初始化swiper 
                    observeParents:true//修改swiper的父元素时，自动初始化swiper 
                },

                
            }
        },
        created(){
            console.log("数据安排")
            this._getRecommend();
            this._getDescList();
        },
        mounted() {
                console.log("scroll启动")
                this._scroll();
        },
        methods: {
            _scroll() {
                    this.scroll = new BScroll(this.$refs.wrapper)
            },
            _getRecommend() {
                getRecommend().then((res) => {
                    if(res.code === 0) {
                    //    this.songList = res.data.songList;
                        this.recommend_pic = res.data.slider
                    }
                } )
            },
            _getDescList() {
                getDescList().then((res) => {
                    if(res.data.code === 0) {
                        this.songList = res.data.data.list
                    }
                })
            },
            refresh_() {
                if(!this.check) {
                    console.log("刷新")
                    this.scroll.refresh();
                    this.check = true;
                }      
            },
            enterSongList(item) {
                this.$router.push({
                    path:`/recommend/${item.dissid}`
                })
                this.$store.commit('changeDisc', item)
            }
        },
        // computed: {
		// 	swiper() {
		// 		return this.$refs.mySwiper.swiper
		// 	}
		// },

    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

 

  .recommend {
    height:100%;
	position: fixed;
	width: 100%;
	top: 88px;
    bottom: 0;
    overflow: hidden;
}

.recommend-content {
	overflow: hidden;
}

.slider-wrapper {
    position: relative;
	overflow: hidden;
	width: 100%;
	height: 0;
	padding-bottom: 42.10%;
}

.swiper-img {
	width: 100%;
}

.list-title {
	height: 65px;
	line-height: 65px;
	text-align: center;
	font-size: $font-size-medium;
	color: $color-theme;
}
.songlist {

    width:50%;
    height: auto;
    padding: .4rem;
    box-sizing: border-box;

}
.song_pic {
    width:100%;
}
.songs_img {
    width: 100%
}

.lo {
    display:flex;
    flex-wrap: wrap;
    justify-content:center;

}

.item {
	display: flex;
	box-sizing: border-box;
	align-items: center;
	padding: 0 20px 20px 20px;
}

.icon {
	flex: 0 0 60px;
	width: 60px;
	padding-right: 20px;
}

.text {
	display: flex;
	flex-direction: column;
	justify-content: center;
	flex: 1;
	line-height: 20px;
	overflow: hidden;
	font-size: $font-size-medium;
}

.name {
	margin-bottom: 10px;
	color: $color-text;
}

.desc {
	color: $color-text-d;
}

.loading-container {
	position: absolute;
	width: 100%;
	top: 50%;
	transform: translateY(-50%);
}
       
</style>