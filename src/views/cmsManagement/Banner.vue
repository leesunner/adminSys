<template>
  <div>
    <el-row>
      <el-form inline :model="searchData" size="mini">
        <el-form-item>
          <el-input v-model="searchData.username" clearable placeholder="请输入banner标题"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchData.createUserRealName" clearable placeholder="请输入创建人姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="getPageList"
                     v-if="buttonControl[_config.buttonCode.B_LIST]"
                     icon="el-icon-search">查询
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="createShow = true"
                     v-if="buttonControl[_config.buttonCode.B_CREATE]"
                     icon="el-icon-plus">创建banner
          </el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <!-- 用户列表表格 -->
    <el-table size="mini" :data="tableData.list" border style="width: 100%">
      <el-table-column prop="title" label="banner标题"></el-table-column>
      <el-table-column label="图片(点击查看大图)" width="240">
        <template v-slot="scope">
          <el-image
            v-if="scope.row.imgUrl"
            :src="scope.row.imgUrl"
            :preview-src-list="[scope.row.imgUrl]"
            fit="scale-down"></el-image>
          <span v-else>暂无图片</span>
        </template>
      </el-table-column>
      <el-table-column label="展示端" prop="showType" width="70"></el-table-column>
      <el-table-column label="创建时间">
        <template v-slot="scope">
          <span>{{scope.row.createTime | formatTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="createUserRealName" width="160"></el-table-column>
      <el-table-column label="状态" width="90">
        <template v-slot="scope">
          <el-link :underline="false" :type="scope.row.enable?'success':'danger'">{{scope.row.enable?'已启用':'已禁用'}}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template v-slot="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-view"
            v-if="buttonControl[_config.buttonCode.B_DETAIL]"
            @click="handleEdit(scope.row)"
          >详情
          </el-button>
          <el-button
            :type="scope.row.enable?'success':'danger'"
            size="mini"
            icon="el-icon-edit"
            v-if="buttonControl[_config.buttonCode.B_STATUS]"
            @click="handleDelete(scope.row)"
          >{{scope.row.enable?'已启用':'已禁用'}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      class="pagination"
      layout="total, sizes, prev, pager, next"
      :total="tableData.total"
      :page-sizes="_config.sizeArr"
      :page-size="searchData.pageSize"
      :current-page="searchData.pageNum"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
    <create-banner :show="createShow"
                   :buttonControl="buttonControl"
                   @close="handleClose"
                   :showTypeRadio="showTypeRadio"
                   :itemId="editId"
                   @fresh="getPageList"></create-banner>
  </div>
</template>

<script>
  const createBanner = () => import('@/components/banner/createBanner')
  import mixin from '@/mixin/buttonPermission'

  export default {
    mixins: [mixin],
    name: "banner",
    components: {createBanner},
    data() {
      return {
        createShow: false,
        searchData: {
          //用户列表查询条件
          pageNum: 1,
          pageSize: this._config.sizeArr[0],
          title: '',
          enable: '',
          createUserRealName:'',
        },
        showTypeRadio: [],
        tableData: {},
        srcList: [],
        editId: '',
      }
    },
    created() {
      this.showRadioType()
      this.getPageList()
    },
    methods: {
      //获取类型
      showRadioType() {
        this.$request.get(`${this.$apiList.banner}/show-type`).then(res => {
          this.showTypeRadio = res.data.data
        })
      },
      //关闭弹框回调
      handleClose(val) {
        this.createShow = val
        this.editId = ''
      },
      //编辑
      handleEdit(data) {
        this.editId = data.id
        this.createShow = true
      },
      handleDelete(data) {
        this.$request.put(`${this.$apiList.banner}/enable`, {
          id: data.id,
          enable: !data.enable
        }).then(res => {
          this.$message.success('修改成功')
          this.getPageList()
        })
      },
      //获取列表信息
      getPageList() {
        this.$request.get(this.$apiList.banner, this.searchData).then(res => {
          this.tableData = res.data.data
          this.srcList = []
          this.tableData.list.forEach(item => {
            this.srcList.push(item.imgUrl)
          })
        })
      },
      // 翻页
      handleCurrentChange(val) {
        this.searchData.pageNum = val;
        this.getPageList();
      },
      // 修改每页显示数量
      handleSizeChange(val) {
        this.searchData.pageSize = val;
        this.getPageList();
      }
    }
  }
</script>

<style scoped>

</style>
