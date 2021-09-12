<template>
  <div class="cart-list">
    <scroll class="content" ref="scroll">
      <!-- <li v-for="(item, index) in cartList" :key="index">{{item}}</li> -->
      <cart-list-item v-for="(item, index) in cartList" :key="index" :product="item"></cart-list-item>
    </scroll>
  </div>
</template>

<script>
import Scroll from 'components/common/scroll/Scroll'
import CartListItem from './CartListItem.vue'


export default {
  data () {
    return {
      cartList: []  
    }
  },
  components: {
    Scroll,
    CartListItem
  },
  created () {
    this.cartList = this.$store.state.cartList
    console.log(this.cartList);
  },
  activated () {
    this.$refs.scroll.scroll.refresh()
  }
}
</script>

<style scoped>
  .cart-list {
    height: calc(100% - 94px);
  }

  .content {
    height: 100%;
    overflow: hidden;
  }
</style>