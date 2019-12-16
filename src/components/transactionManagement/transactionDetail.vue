<template>
  <el-dialog :title="'流程详情'" :visible.sync="$attrs.show" @close="close" width="685px">
    <el-form label-width="140px"
             size="mini"
             :rules="rules"
             class="form"
             ref="formRules"
             v-if="requestShow"
             :model="formData">
      <el-form-item :label="item.formTitle" :prop="item.formNotNull?item.formId:''" v-for="(item,index) in formList" :key="index+5" v-if="item.formType !='buttons'">
        <el-input
          v-if="item.formType ==='text' "
          :placeholder="`输入${item.formTitle}`"
          clearable
          v-model="formData[item.formId]">
        </el-input>
        <el-input
          v-if="item.formType ==='longText'"
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5}"
          :placeholder="`输入${item.formTitle}`"
          clearable
          v-model="formData[item.formId]">
        </el-input>
        <el-date-picker
          v-if="item.formType ==='date'"
          clearable
          v-model="formData[item.formId]"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
        <el-select v-model="formData[item.formId]"
                   clearable
                   @change="change"
                   v-if="item.formType ==='combox'"
                   :placeholder="`选择${item.formTitle}`">
          <el-option
            v-for="selectItem in formData.combox"
            :key="selectItem"
            :label="selectItem"
            :value="selectItem">
          </el-option>
        </el-select>
        <el-input
          v-if="item.formType ==='label'"
          disabled
          :autosize="{ minRows: 3, maxRows: 5}"
          type="textarea"
          v-model="formData[item.formId]">
        </el-input>
        <!--<el-upload-->
          <!--v-if="item.formType ==='file'|| item.formType ==='image'"-->
          <!--:action="$baseUrl+$apiList.fileUpload"-->
          <!--:on-success="handleAvatarSuccess"-->
          <!--:on-error="handleAvatarError"-->
          <!--:before-upload="beforeAvatarUpload"-->
          <!--:on-remove="handleRemove"-->
          <!--:on-preview="handlePictureCardPreview"-->
          <!--list-type="picture-card"-->
          <!--:file-list="getJsonArr(item.formDefaultValue)"-->
          <!--:limit="5"-->
          <!--:auto-upload="true">-->
          <!--<i class="el-icon-plus"></i>-->
        <!--</el-upload>-->
        <!--<el-row style="padding-left: 12px;font-size: 12px;color: #f56c6c;" v-if="item.formType ==='file'|| item.formType ==='image'">-->
          <!--* 上传限制2MB-->
        <!--</el-row>-->
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
      <el-button size="mini" @click="submit(item.url)" type="primary" v-for="(item,index) in formData.buttons" :key="index+50">{{item.name}}</el-button>
    </div>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="imgUrl" alt="">
    </el-dialog>
  </el-dialog>
</template>

<script>
  export default {
    props:['taskId'],
    name: "transaction-detail",
    data() {
      return {
        formList:[],
        formData: {},
        rules:{},
        dialogVisible:false,
        imgUrl:'',
        requestShow:false,
      }
    },
    watch:{
      '$attrs.show'(newVal){
        if (newVal){
          this.getFormStructure()
        }
      },
    },
    methods:{
      close(){
        this.requestShow = false
        this.$emit('close',false)
      },
      change(val){
        console.log(val)
      },
      //处理转换数组
      getJsonArr(val){
        if (val){
          const type = Object.prototype.toString.call(val)
          if (type=='[object Array]'){
            return JSON.parse(val)
          }else{
            return [val]
          }
        }else{
          return []
        }
      },
      //按钮提交信息
      submit(url){
        console.log(this.formData)
        this.$refs['formRules'].validate(valid => {
          if (valid) {
            this.$request.post(url,this.formData).then(res=>{
              this.$message.success(res.data.msg)
            })
          }
        })
      },
      //获取表结构
      getFormStructure(){
        this.$request.get(`${this.$apiList.workFlow}/form/info/${this.taskId}`).then(res=>{
          const arr =res.data.data
          arr.forEach(item=>{
            if (item.formType ==='buttons'||item.formType ==="combox"){
              this.formData[item.formId] = ""
              this.formData[item.formType] = JSON.parse(item.formDefaultValue)
            }else{
              this.formData[item.formId] = item.formDefaultValue
            }
            if (item.formNotNull){
              this.rules[item.formId] = [{ required: true, message: `请输入${item.formTitle}`, trigger: 'blur' }]
            }
          })
          this.requestShow = true
          this.formList = arr
        })
      },
      //上传成功回调
      handleAvatarSuccess(res, file) {
        if (res.code == 200) {
          this.columnData.logo = res.data
          this.editData.logo = res.data
          this.editData.url = res.data
        } else {
          this.$message.error(res.msg)
        }
      },
      //上传出错回调
      handleAvatarError(err) {
        this.$message.error('上传发生错误')
      },
      //上传拦截
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isLt2M;
      },
      //删除图片
      handleRemove(file) {
        this.imgUrl = ''
      },
      //浏览大图
      handlePictureCardPreview(file) {
        console.log(file)
        this.dialogVisible = true;
      },
    }
  }
</script>

<style lang="scss" scoped>
  .form{
   & /deep/.el-input__inner{
      width: 505px;
    }
  }

</style>
