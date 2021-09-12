import BackTop from "components/content/backTop/BackTop";

export const backTopMixin = {
  data () {
    return {
      isShowBackUp: false,
    }
  },
  components: {
    BackTop
  },
  methods: {
    backClick() {
      // console.log(1);
      this.$refs.scroll.scroll.scrollTo(0, 0, 500);
    },
  }
}