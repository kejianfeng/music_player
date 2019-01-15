<template>
  <div id="app">
      <m-header></m-header>
      <tab-link></tab-link>
      <keep-alive>
          <router-view>
          </router-view>
      </keep-alive>
      <player></player>
      
  </div>
</template>
<script>
import MHeader from './components/m-header/m-header'
import TabLink from './components/tab/tab'
import Player from './components/player/player'

export default {
  name: 'App',
  components: {
      MHeader,
      TabLink,
      Player
  }
}
</script>

<style lang="stylus" scoped>
  @import 'common/stylus/variable'
</style>
