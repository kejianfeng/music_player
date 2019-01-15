// import originJSONP from 'jsonp'
// export default function jsonp(url, data, option) { //这里的data是要发送出去的参数
//     url += (url.indexOf('?') < 0)? '?' : '&'  //如果有问号了就拼接&，没有就拼接？
//     return new Promise((resolve, reject) => {
//         originJSONP(url, option, (err, data) => { //三个参数是参照jsonpw文档的,url为请求地址，data为请求到的数据
//             if (!err) {
//                 // console.log(url)
//                 resolve(data)//传递data
//             }
//             else {
//                 console.log(66666)
//                 reject(err)
//             }
//         })
//     })
// }


// function param(data) {
//     let url = ''
//     for (var k in data) {
//         let value = data[k] !== undefined ? data[k] : ''
//         url += `&${k}=${encodeURIComponent(value)}`   //该方法不会对 ASCII 字母和数字进行编码，也不会对这些 ASCII 标点符号进行编码： - _ . ! ~ * ' ( ) 其他字符（比如 ：;/?:@&=+$,# 这些用于分隔 URI 组件的标点符号），都是由一个或多个十六进制的转义序列替换的

//     }
//     console.log(555555);
//     return url ? url.substring(1):"" ;//url不为空就截取除了第一个元素&后面的地址，
// }



import originJSONP from 'jsonp';

/**
 * 做一个简单的jsonp封装
 * @param url
 * @param data
 * @param option
 * @return {Promise}
 */
export default function jsonp (url, data, option) {
  return new Promise((resolve, reject) => {
    url = `${url}?${_obj2String(data)}`;
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
};

function _obj2String (obj, arr = [], index = 0) {
  let params = [];
  for (let key in obj) {
    params.push(`${key}=${obj[key]}`);
  }
  return params.join('&');
}