
// 打乱数组的算法
function ran (a, b) {
	return a + (b - a + 1) * Math.random() | 0  //加1是因为random()函数取不到1，为了保证能随机到最大的数

}
export function random_arr(arr) {
    for (let i = 0 ; i < arr.length; i++) {
		let as = arr[i];
		var sa = ran(0,i);
		arr[i] = arr[sa]
		arr[sa] = as;
		
	}
	return arr;
}