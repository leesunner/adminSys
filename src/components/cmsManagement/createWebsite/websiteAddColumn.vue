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
      <el-button size="mini" @click="submit" type="primary">提交</el-button>
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
          this.getShowList()
          this.getOwnList()
        }
      },
    },
    methods: {
      close() {
        this.$emit('close', false)
      },
      childTree(arr){
        console.log(arr)
        if (arr.children.length > 0) {
          this.childTree(arr.children)
        } else {
          return arr.id
        }
      },
      //整合拥有的栏目
      childTools(arr) {
        //
        let arrs = arr.map(item=>{
          return this.childTree(item.children)
        })
        console.log(arrs)
        debugger
        arrs.forEach(arrItem => {
          this.tableData.forEach(item => {
            if (arrItem.id==item.id){
              this.$refs.multipleTable.toggleRowSelection(item)
            }else{
              if (item.children.length > 0) {
                this.formatArr(item.children,arrItem.id)
              }
            }
          })
        })
      },
      formatArr(arr,id){
        arr.forEach(item => {
          if (item.children.length > 0) {
            this.formatArr(item.children,id)
          } else {
            if (id==item.id){
              this.$refs.multipleTable.toggleRowSelection(item)
            }
          }
        })
      },
      //查询拥有的栏目
      getOwnList() {
        this.$request.get(`${this.$apiList.website}/${this.itemId}/category`).then(res => {
          const arr = res.data.data
          if (arr.length > 0) {
            this.childTools(arr)
            console.log(this.$refs.multipleTable)
          }
        })
      },
      //查询未隐藏的栏目
      getShowList() {
        this.$request.get(`${this.$apiList.website}/category`).then(res => {
          this.tableData = res.data.data
        })
      },
      //提交选中的栏目
      submit() {
        let obj = {
          categoryIds: this.multipleSelection.length>0?this.multipleSelection.map(item => item.id):[],
          siteId: this.itemId
        }
        this.$request.post(`${this.$apiList.website}/category`, obj).then(res => {
          this.$message.success(res.data.msg)
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
