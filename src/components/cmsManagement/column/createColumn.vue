<template>
  <el-dialog title="创建顶级栏目" :visible.sync="$attrs.show" @close="close">
    <el-form label-width="100px"
             size="mini"
             :rules="rules"
             ref="formRules"
             :model="columnData">
      <el-form-item label="栏目名称" prop="name">
        <el-input
          placeholder="输入栏目名称"
          clearable
          v-model="columnData.name">
        </el-input>
      </el-form-item>
      <el-form-item label="栏目开关">
        <el-tooltip :content="columnData.hideStatus?'隐藏后看不到栏目':'现在可以看到栏目了'" placement="right">
          <el-switch
            v-model="columnData.hideStatus"
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
      <el-button size="mini" @click="create" type="primary">创建</el-button>
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
          hideStatus: false,//隐藏
          siteId: 1,
          parentId: 0,//顶级目录是0
        },
        rules: {
          name: [{required: true, message: '请输入栏目名', trigger: 'blur'}],
        }
      }
    },
    methods: {
      close() {
        this.$emit('close', false)
      },
      create() {
        this.$refs['formRules'].validate(valid => {
          if (valid) {
            this.columnData.parentId = this.topId ? this.topId : 0
            this.$request.post(this.$apiList.category, this.columnData).then(res => {
              this.$message.success(res.data.msg)
            })
          }
        })
      },
    }
  }
</script>

<style scoped>

</style>
