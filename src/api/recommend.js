import jsonp  from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

//获取轮播图数据
export function getRecommend() {
    const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';
    const data = Object.assign({}, commonParams,{//拼接对象
        platform: 'h5',
        uin: 0,
        needNewCode:1,

    })
    return jsonp(url, data, options)
}


//以下均需后端代理

//获取歌单列表 数据
export function getDescList () {
    const data = Object.assign({}, commonParams, {
      rnd: Math.random(),
      hostUin: 0,
      notice: 0,
      format: 'json',
      platform: 'yqq',
      needNewCode: 0,
      categoryId: 10000000,
      sortId: 5,
      sin: 0,
      ein: 29
    })
    return axios.get('/api/desclist', {
        params: data
      });
}

//获取歌单歌曲
export function getDescListSongs(dissid) {
    const data = Object.assign({}, commonParams,{//拼接对象
        type: 1,
        json: 1,
        utf8: 1,
        onlysong: 0,
        disstid:dissid,  //大坑啊,这里居然是disstid，多了个t!!!!
        g_tk: 5381,
        loginUin: 0,
        hostUin: 0,
        format: 'json',
        notice: 0,
        platform: 'yqq',
        needNewCode: 0,

    })
    return axios.get('/api/desc_song', {
        params: data
      });
}