//用来做tree的搜索功能
export default {
  data(){
    return{
      filterText:'',//搜索绑定字段
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      let caseName = data.name||data.menuName||data.locationName
      return caseName.indexOf(value) !== -1;
    },
  }
}
