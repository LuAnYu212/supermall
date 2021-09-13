<template>
  <div id="detail">
    <detail-nav-bar
      class="detail-nav"
      @titleClick="titleClick"
      ref="nav"
    ></detail-nav-bar>
    <scroll
      class="contents"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
    >
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info
        :detail-info="detailInfo"
        @imageLoad="detaiImageLoad"
      ></detail-goods-info>
      <detail-param-info
        ref="params"
        :param-info="paramInfo"
      ></detail-param-info>
      <detail-comment-info
        ref="comment"
        :comment-info="commentInfo"
      ></detail-comment-info>
      <goods-list ref="recommend" :goods="recommend"></goods-list>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackUp"></back-top>
    <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>

    <toast message="hhhhhhhhhhhhhh">

    </toast>
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar.vue";
import DetailSwiper from "./childComps/DetailSwiper.vue";
import DetailBaseInfo from "./childComps/DetailBaseInfo.vue";
import DetailShopInfo from "./childComps/DetailShopInfo.vue";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo.vue";
import DetailParamInfo from "./childComps/DetailParamInfo.vue";
import DetailCommentInfo from "./childComps/DetailCommentInfo.vue";
import DetailBottomBar from "./childComps/DetailBottomBar.vue";
import BackTop from "components/content/backTop/BackTop";

import Scroll from "components/common/scroll/Scroll";
import GoodsList from "components/content/goods/GoodsList";
import Toast from 'components/common/toast/Toast'

import {
  getDetail,
  Goods,
  Shop,
  GoodsParam,
  getRecommmend,
} from "network/detail";

export default {
  name: "Detail",
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommend: [],
      themeTopYs: [],
      currentIndex: 0,
      isShowBackUp: false,
    };
  },
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    BackTop,

    Scroll,
    GoodsList,
    Toast
  },
  created() {
    this.iid = this.$route.params.iid;
    // console.log(this.iid);
    getDetail(this.iid).then((res) => {
      // 获取轮播图数据
      // console.log(res);
      const data = res.result;
      this.topImages = data.itemInfo.topImages;

      // 获取商品信息
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );

      // 创建店铺信息
      this.shop = new Shop(data.shopInfo);

      // 保存商品详情数据
      this.detailInfo = data.detailInfo;

      // 获取参数信息
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );

      // 取出评论信息
      if (data.rate.cRate != 0) {
        this.commentInfo = data.rate.list[0];
      }

      // 请求推荐数据
      getRecommmend().then((res) => {
        // console.log(res);
        this.recommend = res.data.list;
      });
    });
  },
  mounted() {},
  updated() {
    // 此段代码放在mounted或者$nextTick中都不对
    // 因为offseTop的值都没有所有图片加载完
    // this.themeTopYs = []
    // this.themeTopYs.push(0)
    // this.themeTopYs.push(this.$refs.params.$el.offsetTop)
    // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
    // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
    // console.log(this.themeTopYs);
  },
  methods: {
    titleClick(index) {
      // console.log(index);
      this.$refs.scroll.scroll.scrollTo(0, -this.themeTopYs[index] + 44, 500);
    },
    detaiImageLoad() {
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      // console.log(this.themeTopYs);
    },
    contentScroll(position) {
      // console.log(position);
      const positionY = -position.y;
      if (positionY < this.themeTopYs[1]) {
        // console.log(1);
        this.currentIndex = 0;
        this.$refs.nav.currentIndex = this.currentIndex;
      } else if (
        positionY >= this.themeTopYs[1] &&
        positionY < this.themeTopYs[2]
      ) {
        // console.log(2);
        this.currentIndex = 1;
        this.$refs.nav.currentIndex = this.currentIndex;
      } else if (
        positionY >= this.themeTopYs[2] &&
        positionY < this.themeTopYs[3]
      ) {
        // console.log(3);
        this.currentIndex = 2;
        this.$refs.nav.currentIndex = this.currentIndex;
      } else {
        // console.log(4);
        this.currentIndex = 3;
        this.$refs.nav.currentIndex = this.currentIndex;
      }
      // 判断backtop是否显示
      this.isShowBackUp = -position.y > 1000;
    },
    backClick() {
      // console.log(1);
      this.$refs.scroll.scroll.scrollTo(0, 0, 500);
    },
    addToCart() {
      // console.log(1);
      // 获取购物车要展示的信息
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.titile
      product.desc = this.goods.desc
      product.price = this.goods.realPrice
      product.iid = this.iid
      // console.log(product);

      // 将商品添加到购物车
      // this.$store.cartList.push(product)
      // this.$store.commit('addCart', product)
      this.$store.dispatch('addCart', product).then(res => {
        console.log(res);
      })
    }
  },
};
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.contents {
  height: calc(100% - 100px);
}
</style>