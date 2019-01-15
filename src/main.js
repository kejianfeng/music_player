import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'
import 'common/stylus/index.styl'
import 'swiper/dist/css/swiper.css'
fastclick.attach(document.body)  //应用fastclick到文档的body中去

Vue.config.productionTip = false
import VueAwesomeSwiper from 'vue-awesome-swiper'
import VueLazyload from 'vue-lazyload';
 
Vue.use(VueAwesomeSwiper)
Vue.use(VueLazyload, {
  loading:require('common/image/default.png')

})





/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
