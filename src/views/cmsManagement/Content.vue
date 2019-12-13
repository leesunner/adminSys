<template>
  <div>
    <el-row>
      <el-form inline :model="searchData" size="mini">
        <span>
          <el-form-item>
            <el-input v-model="searchData.titleName" clearable placeholder="输入标题名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getListByPage" icon="el-icon-search">查询</el-button>
          </el-form-item>
           <el-form-item>
          <el-button type="primary" @click="showCreate = true" icon="el-icon-plus">发布文档</el-button>
        </el-form-item>
        </span>
      </el-form>
    </el-row>
    <div>
      <!-- 用户列表表格 -->
      <el-table size="mini"
                :data="contentData.list"
                border
                tooltip-effect="dark"
                ref="multipleTable"
                @selection-change="handleSelectionChange"
                style="width: 100%">
        <el-table-column
          type="selection"
          label="选择"
          width="40">
        </el-table-column>
        <el-table-column type="id" label="ID" width="50"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="realName" label="所属栏目"></el-table-column>
        <el-table-column prop="telephone" label="浏览量"></el-table-column>
        <el-table-column prop="telephone" label="审核"></el-table-column>
        <el-table-column prop="email" label="更新时间"></el-table-column>
        <el-table-column label="操作" width="420">
          <template v-slot="scope">
            <el-button
              type="success"
              size="mini"
              icon="el-icon-view"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑
            </el-button>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-view"
              @click="handleLook(scope.$index, scope.row)"
            >预览
            </el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-edit"
              @click="handleHide(scope.$index, scope.row)"
            >隐藏
            </el-button>
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-edit"
              @click="handleDelete(scope.$index, scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        class="pagination"
        layout="total, sizes, prev, pager, next"
        :total="contentData.total"
        :page-sizes="_config.sizeArr"
        :page-size="searchData.pageSize"
        :current-page="searchData.pageNum"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    name: "content",
    data(){
      return{
        //查询提交的数据
        searchData:{
          titleName:'',
          pageSize:this._config.sizeArr[0],
          pageNum: 1,
        },
        //新增文档弹框
        showCreate:false,
        //表格列表数据源
        contentData:{},
        //多选数据源
        multipleSelection:[],
      }
    },
    methods:{
      getListByPage(){},
      handleSelectionChange(val){
        this.multipleSelection = val;
      },
      //隐藏栏目
      handleHide() {
      },
      //编辑
      handleEdit() {
      },
      //删除栏目
      handleDelete() {
      },
      //查看预览
      handleLook(){},
      // 翻页
      handleCurrentChange(val) {
        this.searchData.pageNum = val;
        this.getListByPage();
      },
      // 修改每页显示数量
      handleSizeChange(val) {
        this.searchData.pageSize = val;
        this.getListByPage();
      }
    }
  }
</script>

<style scoped>

</style>
