import Vue from 'vue'
import Vuex from 'vuex'
import {playMode} from 'common/js/play_state'
import {random_arr} from 'common/js/random_arr'

Vue.use(Vuex)
export default new Vuex.Store({
    state:{
      singer: {}, //当前歌手信息，包括名字，图片地址，id（即mid值）
      disc:{},
      topList:{},
      play: false,  //当前歌曲播放状态
      fullScreen: false, //是否全屏
      playList: [],  //当前播放列表 
      sequenceList: [], //顺序播放列表，当播放模式为顺序播放时，playList与sequenceList是一致的
      mode: playMode.sequence,  //在playMode对象定义好的播放模式，这样显得更语义化
      currrentIndex:-1  //当前播放歌曲在播放列表的索引，通过播放索引可以算出当前播放的歌曲信息，即playList[currrentIndex]

    },


    mutations: { 
        changeSinger (state, singer_now) {  //前面需为state, 后面为commit过来的参数
            state.singer = singer_now;
            console.log(state.singer.name);
        },

        changePlayerState (state, {index, songs}) {
            state.play = true;
            state.fullScreen = true;
            state.currrentIndex = index;
            state.playList = songs;
            state.sequenceList =  songs;
        },
        mini_player(state) {
            state.fullScreen = false;
        },
        fullScreen_(state) {
            state.fullScreen = true;
        },
        _toggle_play(state) {
            state.play = (state.play)? false : true
        },
        _mini_toggle_play_(state) {
            state.play = (state.play)? false : true
        },
        _next_song(state) {
            if(state.currrentIndex == (state.playList.length-1)) {
                state.currrentIndex = 0;
            }
            else {
                state.currrentIndex += 1;
            }
            state.play = true;
        },
        _pre_song(state) {
            if(state.currrentIndex == 0) {
                state.currrentIndex = state.playList.length - 1;
            }
            else {
                state.currrentIndex -=1;
            }
            state.play = true;
        },
        toChangeMode(state) {
            state.mode = (state.mode + 1) % 3;
            console.log(1)
            console.log(state.sequenceList)
            let newList = null;

            if (state.mode == 2) {
                console.log(2)
                console.log(state.sequenceList)
                newList = random_arr(state.playList);
                console.log(3)
                console.log(state.sequenceList)
            }
            else {
                // console.log(state.sequenceList)
                newList = state.sequenceList
            }
            state.playList = newList;
        },
        toPlayAll(state, songs) {
            state.play = true;
            state.fullScreen = true;
            state.currrentIndex = 0;
            state.playList = songs;
            state.sequenceList =  songs;
        },
        changeDisc(state, item) {
            state.disc = item
        },
        changeTopList(state, item) {
            state.topList = item;
        }
    }

})