

import { getSongVkey, getSongURL, getLyrics} from 'api/song';
import {Base64} from 'js-base64'  //这是一个用于解码的库，用法简单
import { rejects } from 'assert';

export default class Song {
    constructor({id, mid, singer, name, ablum, duration, image, url}) {
        this.id = id;
        this.mid = mid;
        this.singer = singer
        this.name = name;
        this.ablum = ablum;
        this.duration = duration;
        this.image = image;
        this.url = url;
    }
    // 获取歌曲的歌词，getLyrics作为这个类的一个方法，要调用才生效
    getLyrics(){
        if(this.lyric) {
            return Promise.resolve(this.lyric)
        }
        else {
            return new Promise ((resolve, reject) => {
                getLyrics(this.id).then((res) => {  //在这之前定义好 this.id
                    if(res.retcode === 0) {
                        this.lyric = _decodeLyrics(res.lyric);
                        resolve(this.lyric)
                    }
                    else {
                        reject('sorry, no lyric')
                    }
                })
            })
        }
       
    }
}
//因为请求回来的原始歌词不是64位编码，需要用此方法正常解码歌词
function _decodeLyrics (lyrics) {
    let div = document.createElement('div');
    div.innerHTML = lyrics;
    return div.innerHTML;
  }
//工厂方法创建歌曲对象
export function selectSong(musicData) {
    let vkey = 0;
   return  getSongVkey(musicData.songmid).then((res) => {
        // console.log("执行1")
        if (res.data.items.length > 0) {
            vkey = res.data.items[0].vkey;
            // console.log(vkey)
            if (!vkey) { console.log("sorry, songs gotten failed")}
        }
        let currentSongUrl = getSongURL(musicData.songmid, vkey);
        // console.log(currentSongUrl)
        return  new Song({
           id:musicData.songid,
           mid:musicData.songmid,
           singer:filterSinger(musicData.singer),
           name:musicData.songname,
           ablum:musicData.albumname,
           duration:musicData.interval,
           image:`https://y.gtimg.cn/music/photo_new/T001R300x300M000${musicData.singer[0].mid}.jpg?max_age=2592000`,
           url: currentSongUrl

        })
    })

}
//如果有多个歌手，则聚合
export function filterSinger(singer) {
    let useful = [];
    if(!singer) {
        return ''
    }
    singer.forEach((item) => {
        useful.push(item.name)
    });
    return useful.join('/')
}