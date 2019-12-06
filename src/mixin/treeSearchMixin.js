export default {
  data(){
    return{
      filterText:'',
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
