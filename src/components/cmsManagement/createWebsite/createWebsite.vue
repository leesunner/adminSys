<template>
  <el-dialog :title="itemId?'编辑站点':'创建站点'" :visible.sync="$attrs.show" @close="close" width="717px">
    <el-form label-width="100px"
             size="mini"
             inline
             class="website"
             :rules="rules"
             ref="formRules"
             :model="createInfo">
      <el-form-item label="站点名称" prop="name">
        <el-input
          placeholder="输入站点名称"
          clearable
          v-model="createInfo.name">
        </el-input>
      </el-form-item>
      <el-form-item label="站点标题" prop="title">
        <el-input
          placeholder="输入站点标题"
          clearable
          v-model="createInfo.title">
        </el-input>
      </el-form-item>
      <el-form-item label="站点连接" prop="domain">
        <el-input
          placeholder="输入站点连接"
          clearable
          v-model="createInfo.domain">
        </el-input>
      </el-form-item>
      <el-form-item label="版权著作">
        <el-input
          placeholder="输入内容"
          clearable
          v-model="createInfo.copyright">
        </el-input>
      </el-form-item>
      <el-form-item label="省" prop="provinceCode">
        <el-select v-model="createInfo.provinceCode" @change="getCityByProvice"  filterable placeholder="请选择">
          <el-option
            v-for="item in provinceOptions"
            :key="item.locationCode"
            :label="item.locationName"
            :value="item.locationCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="市" prop="cityCode">
        <el-select v-model="createInfo.cityCode" @change="getDistrictByCity" filterable placeholder="请选择">
          <el-option
            v-for="item in cityOptions"
            :key="item.locationCode"
            :label="item.locationName"
            :value="item.locationCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="区(县)" prop="districtCode">
        <el-select v-model="createInfo.districtCode" @change="getTownByDistrict" filterable placeholder="请选择">
          <el-option
            v-for="item in districtOptions"
            :key="item.locationCode"
            :label="item.locationName"
            :value="item.locationCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="街道(乡镇)" prop="townCode">
        <el-select v-model="createInfo.townCode" @change="getVillageByTown" filterable placeholder="请选择">
          <el-option
            v-for="item in townOptions"
            :key="item.locationCode"
            :label="item.locationName"
            :value="item.locationCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="小区(村)" prop="villageCode">
        <el-select v-model="createInfo.villageCode" filterable placeholder="请选择">
          <el-option
            v-for="item in villageOptions"
            :key="item.locationCode"
            :label="item.locationName"
            :value="item.locationCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="启用站点">
        <el-tooltip :content="createInfo.hideStatus?'隐藏后看不到栏目':'现在可以看到栏目了'" placement="right">
          <el-switch
            v-model="createInfo.hideStatus"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="false"
            :inactive-value="true">
          </el-switch>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="站点描述">
        <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 6}"
          placeholder="输入站点描述"
          clearable
          v-model="createInfo.description">
        </el-input>
      </el-form-item>
      <el-row class="rowCon">
        <el-form-item label="站点LOGO" prop="logo">
          <!--编辑弹框-->
          <el-upload
            v-if="itemId"
            :action="$baseUrl+$apiList.fileUpload"
            :data="{businessFileType:6}"
            :on-success="handleAvatarSuccess"
            :on-error="handleAvatarError"
            :before-upload="beforeAvatarUpload"
            :on-remove="handleRemove"
            :on-preview="handlePictureCardPreview"
            list-type="picture-card"
            :file-list="[detailInfo]"
            :headers="headers"
            :limit="1"
            :auto-upload="true">
            <i class="el-icon-plus"></i>
          </el-upload>
          <!--创建弹框-->
          <el-upload
            v-else
            :action="$baseUrl+$apiList.fileUpload"
            :data="{businessFileType:6}"
            :on-success="handleAvatarSuccess"
            :on-error="handleAvatarError"
            :before-upload="beforeAvatarUpload"
            :on-remove="handleRemove"
            :on-preview="handlePictureCardPreview"
            list-type="picture-card"
            :limit="1"
            :headers="headers"
            :auto-upload="true">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-row style="padding-left: 12px;font-size: 12px;color: #f56c6c;">
            * 上传LOGO限制一张
          </el-row>
        </el-form-item>
      </el-row>
    </el-form>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="createInfo.logo" alt="">
    </el-dialog>
    <div slot="footer">
      <el-button size="mini" @click="close">关闭</el-button>
      <el-button size="mini" @click="edit" type="primary" v-if="itemId&&$attrs.buttonControl[_config.buttonCode.B_UPDATE]">保存</el-button>
      <el-button size="mini" @click="create" type="primary" v-if="!itemId&&$attrs.buttonControl[_config.buttonCode.B_CREATE]">创建</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import addressMixin from '@/mixin/addressMixin'
  import ElRow from "element-ui/packages/row/src/row";
  export default {
    components: {ElRow},
    mixins: [addressMixin],
    name: "create-website",
    props: ['itemId'],
    data() {
      return {
        createInfo: {
          description: "",
          cityName: "",
          districtCode: "",
          cityCode: "",
          provinceName: '',
          provinceCode: "",
          districtName: "",
          townCode: '',
          townName: '',
          villageCode: '',
          villageName: '',
          copyright: '',
          domain: "",
          keywords: "",
          logo: "",
          name: "",
          remarks: "",
          title: "",
          hideStatus: false, //隐藏
        },
        headers: {
          'Authorization': `Bearer ${this._funs.getCacheInfo('AUTH_TOKEN')}`
        },
        detailInfo:{},
        dialogVisible: false,
        rules: {
          name: [{required: true, message: '请输入站点名', trigger: 'blur'}],
          domain: [{required: true, message: '请输入站点连接', trigger: 'blur'}],
          title: [{required: true, message: '请输入站点标题', trigger: 'blur'}],
          logo: [{required: true, message: '请上传站点LOGO', trigger: 'blur'}],
          districtCode: [{required: true, message: "请选择县/区", trigger: "change"}],
          cityCode:[{required: true, message: "请选择城市", trigger: "change"}],
          provinceCode: [{required: true, message: "请选择省", trigger: "change"}],
          townCode: [{required: true, message: "请选择乡/镇/街道", trigger: "change"}],
          villageCode: [{required: true, message: "请选择村/小区", trigger: "change"}],
        }
      }
    },
    watch: {
      '$attrs.show'(newVal){
        if (newVal) {
          if (this.itemId){
            this.getWesiteInfo()
            this.getAllRequest()
          }
        }else{
          this.createInfo = this._funs.emptyObj(this.createInfo)
          this.createInfo.hideStatus = false
        }
      },
    },
    methods: {
      close() {
        this.$emit('close', false)
      },
      getAllRequest(){
        this.$request.all([this.getAlreadyProvice()]).then(this.$request.spread((res1) => {
          this.provinceOptions = res1.data.data ||[]
        }))
      },
      //创建
      create() {
        this.$refs['formRules'].validate(valid => {
          if (valid) {
            let data = this.formatFormDatas(this.createInfo)
            this.$request.post(this.$apiList.website, data).then(res => {
              this.$message.success(res.data.msg)
              this.close()
            })
          }
        })
      },
      //编辑
      edit() {
        let data = this.formatFormDatas(this.createInfo)
        this.$request.put(this.$apiList.website, data).then(res => {
          this.$message.success(res.data.msg)
          this.close()
        })
      },
      //获取信息
      getWesiteInfo() {
        this.$request.get(`${this.$apiList.website}/${this.itemId}`).then(res => {
          this.detailInfo = res.data.data
          this.detailInfo.url = res.data.data.logo
          this.createInfo = res.data.data
          this.createInfo.url = res.data.data.logo
          this.getAddressInfoByDetail(this.detailInfo)
        })
      },
      //上传成功回调
      handleAvatarSuccess(res, file) {
        if (res.code == 200) {
          this.createInfo.logo = res.data
          this.detailInfo.logo = res.data
          this.detailInfo.url = res.data
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
        if (!(file.type=='image/png'||file.type=='image/jpeg')){
          this.$message.error('上传文件类型错误');
          return false
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isLt2M;
      },
      //删除图片
      handleRemove(file) {
        this.createInfo.url = ''
        this.detailInfo.url = ''
      },
      //浏览大图
      handlePictureCardPreview(file) {
        this.dialogVisible = true;
      },
    }
  }
</script>

<style lang="scss" scoped>
.el-upload-img{
  width: 146px;
  height: 146px;
  display: block;
  margin-top: 20px;
}
  .website{
    & /deep/ .el-textarea__inner{
      width: 500px;
    }
  }
  .rowCon{
    & /deep/ .el-form-item__content{
      width: auto;
    }
  }
</style>

