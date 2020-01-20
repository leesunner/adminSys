<template>
  <el-dialog :title="'流程详情'" :visible.sync="$attrs.show" @close="close" width="685px">
    <el-form label-width="140px"
             size="mini"
             class="form"
             ref="formRules"
             :model="formData">
      <el-form-item :label="val.formTitle" v-for="(val,item,index) in formData"
                    :key="val.formId">
        <el-input
          v-if="val.formType ==='lLabel'"
          disabled
          :autosize="{ minRows: 2, maxRows: 4}"
          :placeholder="`输入${val.formTitle}`"
          type="textarea"
          v-model="formData[item].value">
        </el-input>
        <el-input
          v-if="val.formType ==='label'"
          disabled
          :placeholder="`输入${val.formTitle}`"
          v-model="formData[item].value">
        </el-input>
        <el-upload
          v-if="val.formType ==='fileDownload'"
          action=""
          disabled
          :on-preview="handleDownLoad"
          :file-list="formData[item].value">
          点击对应文件下载
        </el-upload>
        <el-upload
          v-if="val.formType ==='imageShow'"
          action=""
          :on-preview="handlePictureCardPreview"
          list-type="picture-card"
          :file-list="formData[item].value"
          disabled>
          禁止上传
        </el-upload>
      </el-form-item>
      <!--<el-form-item label="开关">-->
      <!--<el-tooltip :content="formData.hideStatus?'隐藏后看不到栏目':'现在可以看到栏目了'" placement="right">-->
      <!--<el-switch-->
      <!--v-model="formData.hideStatus"-->
      <!--active-color="#ff4949"-->
      <!--inactive-color="#13ce66"-->
      <!--:active-value="true"-->
      <!--:inactive-value="false">-->
      <!--</el-switch>-->
      <!--</el-tooltip>-->
      <!--</el-form-item>-->
    </el-form>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="imgUrl" alt="">
    </el-dialog>
  </el-dialog>
</template>

<script>
  export default {
    props: ['taskId'],
    name: "show-transaction-detail",
    data() {
      return {
        formData: {},
        btnAndSelect: {},
        dialogVisible: false,
        imgUrl: '',
      }
    },
    watch: {
      '$attrs.show'(newVal) {
        if (newVal) {
          //data获取表数据
          let url = 'data'
          this.getFormStructure(url)
        }
      },
    },
    methods: {
      close() {
        this.$emit('close', false)
      },
      //处理转换数组
      getJsonArr(val) {
        if (val) {
          let arr = JSON.parse(val)
          return arr
        } else {
          return []
        }
      },
      //新建对象(obj:新数据对象，item:数据复制对象，)
      newObject(obj, item) {
        const type = item.formType=='imageShow'||item.formType=='fileDownload'
        obj[item.formId] = {
          value: type?this.getJsonArr(item.formDefaultValue):item.formDefaultValue,
          formType: item.formType,
          formTitle: item.formTitle,
          isMust: item.formNotNull,
        }
      },
      //获取表结构
      getFormStructure(url) {
        this.$request.get(`${this.$apiList.workFlow}/form/${url}/${this.taskId}`).then(res => {
            const arr = res.data.data
            const obj = {}
            // 过滤数据对象
            arr.forEach(item => {
              this.newObject(obj, item)
            })
          //将提取的数据对象赋值给formData（这么用的原因：直接将提取的属性给formData并赋值，会导致表格渲染时无法再输入）
          this.formData = obj
        })
      },
      //下载文件
      handleDownLoad(file){
        const a = document.createElement('a')
        a.href = file.url
        a.download = file.name
        a.target = "_blank"
        a.click()
      },
      //浏览大图
      handlePictureCardPreview(file) {
        this.imgUrl = file.url
        this.dialogVisible = true;
      },
    }
  }
</script>

<style lang="scss" scoped>
  .form {
    & /deep/ .el-input__inner {
      width: 505px;
    }
    & /deep/.el-textarea__inner{
      color: #303133;
    }
  }

</style>
