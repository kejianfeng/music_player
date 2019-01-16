import jsonp  from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

export function getHotSrarchList() {
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
    const data = Object.assign({}, commonParams, {
        g_tk: 5381,
        uin: 0,
        format: 'json',
        notice: 0,
        platform: 'h5',
        needNewCode: 1,
        _: 1547531823787
    })
    return jsonp(url, data, options)
}


export function search(query, page, zhida,perpage) {
    const data = Object.assign({}, commonParams, {
        g_tk: 5381,
        uin: 0,
        format: 'json',
        notice: 0,
        platform: 'h5',
        needNewCode: 1,
        w: query,
        zhidaqu: zhida ? 1 :0,
        catZhida: zhida ? 1 :0,
        t: 0,
        flag: 1,
        ie: 'utf-8',
        sem: 1,
        aggr: 0,
        perpage,
        n: 20,
        p: page,
        remoteplace: 'txt.mqq.all',
        _: 1547536554289
    })
    return axios.get('/api/getSearch', {
        params:data
    })
}