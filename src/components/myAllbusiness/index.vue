<template>
  <el-dialog :title="'事件详情'" :visible.sync="$attrs.show" @close="close" width="685px">
    <el-form label-width="140px" size="mini" class="form" ref="formRules" :model="formData">
      <el-form-item label="事件名称">
        <el-input disabled :placeholder="``" clearable v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-input disabled :placeholder="``" clearable v-model="formData.createTime"></el-input>
      </el-form-item>
      <el-form-item label="发起人姓名">
        <el-input disabled :placeholder="``" clearable v-model="formData.realName"></el-input>
      </el-form-item>
      <el-form-item label="业务当前状态">
        <el-input disabled :placeholder="``" clearable v-model="formData.status"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="mini" @click="close">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { formatTime } from "../../filters/filters";
export default {
  props: ["taskId"],
  name: "my-all-business",
  data() {
    return {
      formData: {
        name: "",
        createTime: "",
        realName: "",
        status: ""
      },
    };
  },
  watch: {
    "$attrs.show"(newVal) {
      if (newVal) {
        this.getFormData();
      }
    }
  },
  methods: {
    close() {
      this.$emit("close", false);
    },
    //获取表信息
    getFormData() {
      this.$request
        .get(`${this.$apiList.applyProc}/${this.taskId}`)
        .then(res => {
          this.formData = res.data.data[0];
          this.formData.createTime = formatTime(this.formData.createTime);
        });
    },
  }
};
</script>

<style lang="scss" scoped>
.form {
  & /deep/ .el-input__inner {
    width: 505px;
  }
}
</style>
