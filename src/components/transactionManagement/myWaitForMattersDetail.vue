<template>
  <el-dialog :title="'流程详情'" :visible.sync="$attrs.show" @close="close" width="685px">
    <el-form label-width="140px"
             size="mini"
             class="form"
             ref="formRules"
             :model="formData">
      <el-form-item :label="val.formTitle" :required="val.isMust?true:false" v-for="(val,item,index) in formData"
                    :key="val.formId" v-if="val.formType !='buttons'">
        <el-input
          v-if="val.formType ==='text'"
          :placeholder="`输入${val.formTitle}`"
          clearable
          v-model="formData[item].value">
        </el-input>
        <el-input
          v-if="val.formType ==='longText'"
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5}"
          :placeholder="`输入${val.formTitle}`"
          clearable
          v-model="formData[item].value">
        </el-input>
        <el-date-picker
          v-if="val.formType ==='date'"
          clearable
          v-model="formData[item].value"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
        <el-select v-model="formData[item].value"
                   clearable
                   v-if="val.formType ==='combox'"
                   :placeholder="`选择${val.formTitle}`">
          <el-option
            v-for="selectItem in btnAndSelect.combox"
            :key="selectItem"
            :label="selectItem"
            :value="selectItem">
          </el-option>
        </el-select>
        <el-input
          v-if="val.formType ==='label'"
          disabled
          :autosize="{ minRows: 3, maxRows: 5}"
          :placeholder="`输入${val.formTitle}`"
          type="textarea"
          v-model="formData[item].value">
        </el-input>
        <el-upload
          v-if="val.formType ==='file'"
          :action="$baseUrl+$apiList.fileUpload"
          :headers="headers"
          :on-success="handleAvatarSuccess"
          :on-error="handleAvatarError"
          :before-upload="beforeFileUpload"
          :before-remove="handleBeforeRemove"
          :on-remove="handleRemove"
          :on-preview="handleDownLoad"
          :limit="1"
          :file-list="formData[item].value">
          <el-button size="small" type="primary">点击上传文件</el-button>
        </el-upload>
        <el-upload
          v-if="val.formType ==='image'"
          :action="$baseUrl+$apiList.fileUpload"
          :headers="headers"
          :on-success="handleAvatarSuccess"
          :on-error="handleAvatarError"
          :before-upload="beforeAvatarUpload"
          :before-remove="handleBeforeRemove"
          :on-remove="handleRemove"
          :on-preview="handlePictureCardPreview"
          list-type="picture-card"
          :file-list="formData[item].value"
          :limit="5"
          :auto-upload="true">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-row style="padding-left: 12px;font-size: 12px;color: #f56c6c;"
                v-if="val.formType ==='image'">
          * 图片上传限制 2MB(png/jpg)
        </el-row>
        <el-row style="padding-left: 12px;font-size: 12px;color: #f56c6c;"
                v-if="val.formType ==='file'">
          * 文件上传 TXT/word/excel
        </el-row>
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
    <div slot="footer">
      <el-button size="mini" @click="close">关闭</el-button>
      <el-button size="mini" @click="submit(item.url)" type="primary" v-for="(item,index) in btnAndSelect.buttons"
                 :key="index+50">{{item.name}}
      </el-button>
    </div>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="imgUrl" alt="">
    </el-dialog>
  </el-dialog>
</template>

<script>
  export default {
    props: ['taskId'],
    name: "transaction-detail",
    data() {
      return {
        formData: {},
        btnAndSelect: {},
        dialogVisible: false,
        imgUrl: '',
        headers: {
          'Authorization': `Bearer ${this._session.getSessoin('AUTH_TOKEN')}`
        },
      }
    },
    watch: {
      '$attrs.show'(newVal) {
        if (newVal) {
          //info获取表结构
          let url = 'info'
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
      //过滤提交信息
      filtersSubmitValue(){
        const obj = this.formData
        let newObj = {},control = true;
        for (let i in obj){
          newObj[i] = obj[i].value
          //是必填的，且不能为空
          if (obj[i].isMust&&(obj[i].value==''||obj[i].value.length==0)){
            control = false
            this.$message.warning(`${obj[i].formTitle}不能为空`)
            break;
          }
        }
        if (control){
          return newObj//通过返回数据
        }else{
          return control//不通过返回false
        }
      },
      //按钮提交信息
      submit(url) {
        const data = this.filtersSubmitValue()
        if (data){
          data.taskId = this.taskId
          this.$request.post(this.$gateway+url, data).then(res => {
            this.$message.success(res.data.msg)
            this.$emit('reqList',true)
            this.close()
          })
        }
      },
      //新建对象(obj:新数据对象，item:数据复制对象，)
      newObject(obj, item) {
        const type = item.formType=='image'||item.formType=='file'
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
          console.log(arr)
          arr.forEach(item => {
            //提取按钮以及其他公用数据
            switch (item.formType){
              case 'buttons':
                //按钮
                this.btnAndSelect[item.formType] = JSON.parse(item.formDefaultValue)
                break;
              case 'combox':
                //下拉选择框数据
                this.btnAndSelect[item.formType] = JSON.parse(item.formComboxValue)
                this.newObject(obj, item)
                break;
              default:
                this.newObject(obj, item)
                break;
            }
          })
          //将提取的数据对象赋值给formData（这么用的原因：直接将提取的属性给formData并赋值，会导致表格渲染时无法再输入）
          console.log(obj)
          this.formData = obj
        })
      },
      //查找对应对象添加上传成功的文件
      findFileData(type){
        const obj = this.formData;
        let arr ;
        for (let i in obj){
          if (obj[i].formType==type){
            arr = obj[i].value
            break;
          }
        }
        return arr
      },
      //上传成功回调
      handleAvatarSuccess(res, file, fileList) {
        if (res.code == 200) {
          //文件类型的判断
          if (this._funs.checkFile(file.raw.type)) {
            this.findFileData('file').push({
              uid: file.uid,
              name: file.name,
              url: res.data
            })
          } else {
            this.findFileData('image').push({
              uid: file.uid,
              name: file.name,
              url: res.data
            })
          }
        } else {
          this.$message.error(res.msg)
        }
      },
      //上传出错回调
      handleAvatarError(err) {
        this.$message.error('上传发生错误')
      },
      //上传图片拦截
      beforeAvatarUpload(file) {
        if (!(file.type === 'image/png' || file.type === 'image/jpg')) {
          this.$message.error('只能上传png和jpg格式的图片')
          return false
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isLt2M;
      },
      //上传文件拦截
      beforeFileUpload(file) {
        if (!this._funs.checkFile(file.type)) {
          this.$message.error('上传文件类型不是允许类型');
          return false
        }
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过 10MB!');
        }
        return isLt2M;
      },
      //删除前提示
      handleBeforeRemove(file) {
        return this.$confirm(`确定移除 ${ file.name }？`)
      },
      //删除
      handleRemove(file, fileList) {
        this.dataFileFormat(file.url)
      },
      //从数据中找到文件
      dataFileFormat(url) {
        const obj = this.formData
        let control = false
        for (let i in obj) {
          let type = Object.prototype.toString.call(obj[i].value)
          if (type == '[object Array]') {
            for (let j = 0; j < obj[i].value.length; j++) {
              if (obj[i].value[j].url === url) {
                obj[i].value.splice(j, 1)
                control = true
                break;
              }
            }
          }
          if (control) {
            break;
          }
        }
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
