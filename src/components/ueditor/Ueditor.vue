<template>
  <div>
    <vue-ueditor-wrap v-model="msg" :config="myConfig" :destroy="true"></vue-ueditor-wrap>
  </div>
</template>

<script>
  import VueUeditorWrap from 'vue-ueditor-wrap';
  function urls() {
    let host  = window.location.host;
    let url = window.location.origin+ window.location.pathname
    if(host.indexOf('localhost')>-1){
      url = '../../../'
    }
    return url
  }
  export default {
    name: "ueditor",
    components: {VueUeditorWrap},
    data() {
      return {
        msg:"",
        myConfig: {
          //外部的div不转P
          allowDivTransToP: false,
          //最大字符
          maximumWords: 20000,
          // 编辑器不自动被内容撑高
          autoHeightEnabled: false,
          // 初始容器高度
          initialFrameHeight: 460,
          // 初始容器宽度s
          initialFrameWidth: '100%',
          zIndex:2600,
          // 上传文件接口
          serverUrl: this.$baseUrl+this.$apiList.ueditorFileUpload,
          // UEditor 资源文件的存放路径
          UEDITOR_HOME_URL: `${urls()}static/UEditor/`
        }
      }
    },
    mounted(){
      this.$emit('change',this.msg)
    },
    watch:{
      msg(newVal){
        this.$emit('change',newVal)
      }
    },
  }
</script>

<style scoped>

</style>
