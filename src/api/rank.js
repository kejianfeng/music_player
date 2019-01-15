import jsonp  from 'common/js/jsonp'
import {commonParams, options} from './config'

// export  function getToplist() {
//     const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
//     const data = Object.assign({}, commonParams, {
//         uin: 0,
//         format: 'json',
//         notice: 0,
//         platform: 'h5',
//         needNewCode: 1
//         })
//     return jsonp(url, data,options)
// } 

// 获取排行榜列表
export function getTopList () {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg';
    const data = Object.assign({}, commonParams, {
      uin: 0,
      platform: 'h5',
      needNewCode: 1,
      _: 1531048621885
    });
    return jsonp(url, data, options);
  }

  export function getTopListDetail(topid) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
    const data = Object.assign({}, commonParams, {
      uin: 0,
      format: 'json',
      notice: 0,
      platform: 'h5',
      needNewCode: 1,
      tpl: 3,
      page: 'detail',
      type: 'top',
      topid: topid,
      _: 1547472899069,
    })
    return jsonp(url, data, options)
  }