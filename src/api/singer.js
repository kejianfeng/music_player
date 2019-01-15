
// import {commonParams, options} from './config'
// import jsonp  from 'common/js/jsonp'

// export  function getSingerList() {
//     const url = "https://c.y.qq.com/v8/fcg-bin/v8.fcg";
//     const data = Object.assign({}, commonParams,{
//         loginUin: 0,
//         hostUin: 0,
//         format: 'json',
//         needNewCode: 0,
//         platform: 'yqq.json',
//         channel: 'singer',
//         page: 'list',
//         key: 'all_all_all',
//         pagesize: 100,
//         pagenum: 1,

//         // data: {"comm":{"ct":24,"cv":10000},"singerList":{"module":"Music.SingerListServer","method":"get_singer_list","param":{"area":-100,"sex":-100,"genre":-100,"index":-100,"sin":0,"cur_page":1}}}
//     })
//     return jsonp(url, data, options)
// }



import jsonp from 'common/js/jsonp';
import { commonParams, options } from './config';

export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    g_tk:1928093487,
    format: 'jsonp',
  })

  return jsonp(url, data, options)
}


export function getSingerDetail (id) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  const data = {
    g_tk:5381,
    loginUin:0,
    hostUin:0,
    format:'json',
    inCharset:'utf8',
    outCharset:'utf-8',
    notice:0,
    platform:'yqq.json',
    needNewCode:0,
    singermid:id,
    order:'listen',
    begin:0,
    num:100,
    songstatus:1,
  }
  return jsonp(url, data, options);
}
