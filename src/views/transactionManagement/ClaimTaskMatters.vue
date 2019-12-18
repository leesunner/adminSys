<template>
  <div>

  </div>
</template>

<script>
  export default {
    name: "claim-task-matters",
    data() {
      return {
        tableData:{}
      }
    },
    created(){
      this.getDataList()
    },
    methods:{
      getDataList(){
        this.$request.get(`${this.$apiList.workFlow}/applyProc`).then(res=>{

        })
      }
    }
  }
</script>

<style scoped>

</style>
