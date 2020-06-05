<template>
  <div class="header">
    <el-row class="menu-header">
      <router-link to="/">
        <div class="logo-wrap">
          <h1>百问数字政务系统</h1>
        </div>
      </router-link>
      <div class="header-right">
        <span class="el-dropdown-link">
          <!-- 通知中心 -->
          <el-dropdown>
            <span class="el-dropdown-link">
              <el-badge :value="noticeNum" :max="99" class="item" :hidden="noticeNum<=0">
                <i class="aloneIcon el-icon-bell"></i>
              </el-badge>
            </span>
          <el-dropdown-menu slot="dropdown">
           <el-dropdown-item v-for="item in  noticeList" :key="item.name" @click.native="goPage(item.type)" v-if="noticeList.length>0">
              <span>{{item.name}}:</span>
              <span>{{item.count}}条未处理</span>
           </el-dropdown-item>
            <el-dropdown-item v-else>
              <span>您暂无任何消息！</span>
           </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        </span>
        <el-dropdown>
            <span class="el-dropdown-link">
              <el-avatar :size="38" src></el-avatar>
              <span
                class="user"
              >尊敬的{{userInfo.realName}}用户，{{this.time}}</span>
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="goUserInfo">个人中心</el-dropdown-item>
            <el-dropdown-item divided @click.native="$store.dispatch('loginOut')">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        userInfo: {},
        time: this.timeString(),
        noticeList:[],
        noticeNum:0,
      }
    },
    created() {
      this.userInfo = this.$store.state.login.USER_INFO
      this.getNoticeInfo()
    },
    methods: {
      goPage(type){
        if (type == 1){
          this.$router.push('/feedBack')
        }else{
          this.$router.push('/myWaitForMatters')
        }
      },
      //获取消息信息
      getNoticeInfo(){
        this.$request.get(`${this.$apiList.user}/message`).then(res =>{
            this.noticeList = res.data.data||[]
            this.noticeList.forEach(item=>{
              this.noticeNum+=item.count
            })
        })
      },
      // 修改密码
      goUserInfo() {
        this.$router.push('currentUserInfo');
      },
      timeString() {
        let t = new Date(), h = t.getHours(), m = t.getMinutes();
        if (h<12){
          return '上午好！'
        }else{
          if (h==12&&m<1){
            return '上午好！'
          }else{
            return '下午好！'
          }
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .header {
    background-color: #20242B;
    text-align: right;
    height: 76px;
    & .el-row {
      height: inherit;
    }
    .menu-header {
      color: #fff;
      line-height: 76px;
      padding: 0;
      display: flex;
      .el-dropdown {
        margin-left: 30px;
      }
      .logo-wrap {
        width: 383px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        overflow: hidden;
        img {
          width: 50%;
          margin-left: 40px;
        }
        h1 {
          font-size: 24px;
          color: #fff;
          text-indent: 30px;
          text-align: left;
        }
      }
      .header-right {
        flex: 1;
        padding-right: 20px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .el-dropdown-link {
          display: flex;
          align-items: center;
          cursor: pointer;
          color: #fff;
          img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 10px;
            border: 1px solid #333;
          }
          .user {
            margin-left: 5px;
          }
          .el-badge {
            height: 30px;
          }
          .aloneIcon {
            font-size: 28px;
            vertical-align: top;
          }
        }
        .el-icon-arrow-down {
          font-size: 12px;
        }
      }
    }
  }
</style>
