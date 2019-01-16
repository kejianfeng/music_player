<template>
  <div class="search-list" v-show="history.length">
    <ul>
      <li class="search-item" v-for="(item, index) in history" :key="index" @click="_searchIt(index)">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="_deleSingle(index)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      history: {
        type: Array,
        default: []
      }
    },
    methods: {
      _deleSingle(index) {
        this.$emit('deleSingle', index)
      }
    },
    _searchIt(index) {
      this.$emit('searchIt', index)
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-list
    .search-item
      display: flex
      align-items: center
      height: 40px
      overflow: hidden
      &.list-enter-active, &.list-leave-active
        transition: all 0.1s
      &.list-enter, &.list-leave-to
        height: 0
      .text
        flex: 1
        color: $color-text-l
      .icon
        extend-click()
        .icon-delete
          font-size: $font-size-small
          color: $color-text-d
</style>