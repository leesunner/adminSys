<template>
  <div>
    <vue-ueditor-wrap v-model="msg" :config="myConfig" :destroy="true"></vue-ueditor-wrap>
    <el-row style="text-align: right;margin-top: 12px;margin-right: 15px;">
      <el-button @click="submit" type="primary" size="small">保存内容</el-button>
    </el-row>
  </div>
</template>

<script>
  import VueUeditorWrap from 'vue-ueditor-wrap';

  export default {
    name: "ueditor",
    components: {VueUeditorWrap},
    data() {
      return {
        msg: `您可以点击右上角的屏幕小标全屏编辑内容<img src="http://img.baidu.com/hi/jx2/j_0058.gif"/>`,
        myConfig: {
          //外部的div不转P
          allowDivTransToP: false,
          //最大字符
          maximumWords: 20000,
          // 编辑器不自动被内容撑高
          autoHeightEnabled: false,
          // 初始容器高度
          initialFrameHeight: 240,
          // 初始容器宽度s
          initialFrameWidth: '100%',
          // 上传文件接口
          serverUrl: process.env.BASE_URL+this.$apiList.ueditorFileUpload,
          // UEditor 资源文件的存放路径
          // UEDITOR_HOME_URL: '../../../static/UEditor/'
        }
      }
    },
    methods: {
      submit() {
        this.$request.post(this.$apiList.article,{
          content:this.msg
        })
      }
    }
  }
</script>

<style scoped>

</style>
