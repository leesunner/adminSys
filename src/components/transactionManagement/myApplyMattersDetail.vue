<template>
  <el-dialog title="流程详情" :visible.sync="$attrs.show" @close="close" width="685px" style="max-height: 820px;overflow: hidden;">
    <el-scrollbar style="height: 820px;padding-bottom: 205px;">
      <div class="detail">
        <el-timeline>
          <el-timeline-item
            :timestamp="item.createTime"
            placement="top"
            v-for="(item,index) in data"
            :key="index+5"
            :color="index===data.length-1?'#409eff':'#67c23a'"
            :type:="index===data.length-1?'primary':'success'">
            <el-card>
              <el-form :model="item" label-width="96px">
                <el-form-item label="节点名称：">
                  <span>{{item.name}}</span>
                </el-form-item>
                <el-form-item label="经办人：">
                  <span>{{item.realName?item.realName:'暂无'}}</span>
                </el-form-item>
                <el-form-item label="状态：">
                  <span>{{item.status}}</span>
                </el-form-item>
              </el-form>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-scrollbar>
  </el-dialog>
</template>

<script>
  export default {
    props: ['taskId'],
    name: "my-apply-matters-detail",
    data() {
      return {
        data: [],
        title: {},
      }
    },
    watch: {
      '$attrs.show'(newVal) {
        if (newVal) {
          this.getPageList()
        }
      },
    },
    methods: {
      close() {
        this.$emit('close', false)
      },
      getPageList() {
        this.$request.get(`${this.$apiList.workFlow}/applyProc/${this.taskId}`).then(res => {
          this.data = res.data.data
          this.title = res.data.data[0]
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  .detail {
    & /deep/.el-form-item {
      margin-bottom: 0;
    }
    & /deep/.el-card__body {
      padding: 0;
    }
  }
</style>
