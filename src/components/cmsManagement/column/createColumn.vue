<template>
  <el-dialog :title="$attrs.isEdit?'编辑栏目':'创建栏目'" :visible.sync="$attrs.show" @close="close">
    <el-form label-width="100px"
             size="mini"
             :rules="rules"
             ref="formRules"
             :model="columnData">
      <el-form-item label="栏目名称" prop="name">
        <el-input
          placeholder="输入栏目名称"
          clearable
          :disabled="!$attrs.buttonControl[_config.buttonCode.B_UPDATE]"
          v-model="columnData['name']">
        </el-input>
      </el-form-item>
      <el-form-item label="栏目简称" prop="shortName">
        <el-input
          placeholder="输入栏目简称"
          clearable
          :disabled="!$attrs.buttonControl[_config.buttonCode.B_UPDATE]"
          v-model="columnData['shortName']">
        </el-input>
      </el-form-item>
      <el-form-item label="栏目状态">
        <el-tooltip :content="columnData.hideStatus?'隐藏后看不到栏目':'现在可以看到栏目了'" placement="right">
          <el-switch
            v-model="columnData.hideStatus"
            :disabled="!$attrs.buttonControl[_config.buttonCode.B_UPDATE]"
            active-color="#ff4949"
            inactive-color="#13ce66"
            :active-value="true"
            :inactive-value="false">
          </el-switch>
        </el-tooltip>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="mini" @click="close">关闭</el-button>
      <el-button size="mini" @click="keep" type="primary" v-if="$attrs.isEdit&&$attrs.buttonControl[_config.buttonCode.B_UPDATE]">保存</el-button>
      <el-button size="mini" @click="create" type="primary" v-if="!$attrs.isEdit&&$attrs.buttonControl[_config.buttonCode.B_CREATE]">创建</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: "create-column",
    props: ['topId'],
    data() {
      return {
        columnData: {
          name: '',
          shortName:'',
          hideStatus: false,//显示
          parentId: 0,//顶级目录是0
        },
        rules: {
          name: [{required: true, message: '请输入栏目名', trigger: 'blur'}],
          shortName:[{required: true, message: '请输入栏目简称', trigger: 'blur'}]
        }
      }
    },
    watch:{
      '$attrs.isEdit'(newVal){
        if (newVal){
          this.getInfo()
        }
      },
    },
    methods: {
      close() {
        this.$emit('close', false)
        this.columnData = {
          name: '',
          shortName:'',
          hideStatus: false,//显示
          parentId: 0,//顶级目录是0
        }
      },
      create() {
        this.$refs['formRules'].validate(valid => {
          if (valid) {
            this.columnData.parentId = this.topId ? this.topId : 0
            this.$request.post(this.$apiList.category, this.columnData).then(res => {
              this.$message.success(res.data.msg)
              this.close()
            })
          }
        })
      },
      //获取信息
      getInfo(){
        this.$request.get(`${this.$apiList.category}/${this.$attrs.columnId}`).then(res => {
          this.columnData = res.data.data
        })
      },
      //保存
      keep(){
        this.$refs['formRules'].validate(valid => {
          if (valid) {
            this.$request.put(this.$apiList.category, this.columnData).then(res => {
              this.$message.success(res.data.msg)
              this.close()
            })
          }
        })
      },
    }
  }
</script>

<style scoped>

</style>
