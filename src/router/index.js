import Vue from 'vue'
import Router from 'vue-router'
import App from '../App'
import Singer from '../components/singer/singer'
import Rank from '../components/rank/rank'
import Search from '../components/search/search'
import Recommend from '../components/recommend/recommend'
import SingerDetail from '../components/singer_detail/singer_detail'
import Disc from '../components/disc/disc'
import RankDetail from '../components/toplist/toplist'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect:'/recommend'  //设置默认当前tab
      // name: 'App',
      // component: App
    },
    {
      path:'/singer',
      name:'singer',
      component:Singer,
      children:[
        {
          path:':id' ,//根据id进行跳转
          component:SingerDetail
        }
      ]

    },
    {
      path:'/rank',
      name:'rank',
      component:Rank,
      children: [
        {
          path:':id',
          component: RankDetail
        }
      ]
    },
    {
      path:'/search',
      name:'search',
      component:Search,
      children:[
        {
          path:':id' ,//根据id进行跳转
          component:SingerDetail
        }
      ]

    },
    {
      path:'/recommend',
      name:'recommend',
      component:Recommend,
      children:[{
        path:':id',
        name:'disc',
        component:Disc,

      }]

    }
    
  ]
})
