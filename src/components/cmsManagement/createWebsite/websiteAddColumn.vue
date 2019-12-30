<template>
  <el-dialog title="编辑栏目" :visible.sync="$attrs.show" @close="close">
    <el-table
      :data="tableData"
      style="width: 100%;margin-top: 12px;"
      size="mini"
      tooltip-effect="dark"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
      row-key="id"
      default-expand-all
      :header-row-style="{'background-color': '#f7f7f7'}"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
        type="selection"
        width="45">
      </el-table-column>
      <el-table-column
        prop="id"
        label="ID"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="栏目名称">
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!--<el-pagination-->
    <!--background-->
    <!--class="pagination"-->
    <!--layout="total, sizes, prev, pager, next"-->
    <!--:total="tableData.total"-->
    <!--:page-sizes="pageData.sizeArr"-->
    <!--:page-size="pageData.pageSize"-->
    <!--:current-page="pageData.pageNum"-->
    <!--@current-change="handleCurrentChange"-->
    <!--@size-change="handleSizeChange"-->
    <!--&gt;</el-pagination>-->
    <div slot="footer">
      <el-button size="mini" @click="close">关闭</el-button>
      <el-button size="mini" @click="submit" type="primary" v-if="itemId&&$attrs.buttonControl[_config.buttonCode.B_SUBMIT_COLUMN]">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: "website-add-column",
    props: ['itemId'],
    data() {
      return {
        tableData: [],
        pageData: {
          sizeArr: [10, 15, 20],
          pageSize: 15,
          pageNum: 1,
        },
        multipleSelection: [],
      }
    },
    watch: {
      '$attrs.show'(newVal) {
        if (newVal) {
          // this.getShowList()
          // this.getOwnList()
          this.getAllList()
        }
      },
    },
    methods: {
      close() {
        this.$emit('close', false)
        this.$refs.multipleTable.clearSelection()
      },
      //拥有栏目数据id提取
      childTree(item, arrs) {
        item.forEach(itemArr => {
          arrs.push(itemArr.id)
          if (itemArr.children && itemArr.children.length > 0) {
            this.childTree(itemArr.children, arrs)
          }
        })
      },
      //整合拥有的栏目
      childTools(arr) {
        let arrs = []
        this.childTree(arr, arrs)
        arrs.forEach(arrItem => {
          this.formatArr(this.tableData, arrItem)
        })
      },
      //拥有栏目对比表格数据，提交到选中项中
      formatArr(arr, id) {
        arr.forEach(item => {
          if (id == item.id) {
            this.$refs.multipleTable.toggleRowSelection(item, true)
          }
          if (item.children && item.children.length > 0) {
            this.formatArr(item.children, id)
          }
        })
      },
      getAllList() {
        this.$request.all([this.getShowList(), this.getOwnList()]).then(this.$request.spread((res1, res2) => {
            // 两个请求现在都执行完成
            this.tableData = res1.data.data
            const arr = res2.data.data
            if (arr.length > 0) {
              //解决数据默认勾选的问题
              setTimeout(()=>{
                this.childTools(arr)
              },0)
            }
          })
        )
      },
      //查询拥有的栏目
      getOwnList() {
        return this.$request.get(`${this.$apiList.website}/${this.itemId}/category`)
      },
      //查询未隐藏的栏目
      getShowList() {
        return this.$request.get(`${this.$apiList.website}/category`)

      },
      //提交选中的栏目
      submit() {
        let obj = {
          categoryIds: this.multipleSelection.length > 0 ? this.multipleSelection.map(item => item.id) : [],
          siteId: this.itemId
        }
        this.$request.post(`${this.$apiList.website}/category`, obj).then(res => {
          this.$message.success(res.data.msg)
          this.close()
        })
      },
      //获取选中的栏目
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //获取要绑定的栏目list
      getColumnList() {

      },
      // 翻页（用户未拥有角色列表）
      handleCurrentChange(val) {
        this.pageData.pageNum = val;
        this.getColumnList();
      },
      // 修改每页显示数量
      handleSizeChange(val) {
        this.pageData.pageSize = val;
        this.getColumnList();
      },
    }
  }
</script>

<style scoped>

</style>
