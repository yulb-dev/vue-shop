<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/logo copy.png" width="130px" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="sign_out">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="wi">
        <div id="btn" @click="cut" :class="change">
          <i :class="divicon" ref="i"></i>
        </div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409BFF"
          :collapse="judge"
          :collapse-transition="false"
          :default-active="activePath"
          router
          :unique-opened="true"
        >
          <el-submenu :index="item.id+''" v-for="(item,index) in menulist" :key="item.id">
            <template slot="title">
              <i :class="iconList[index]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/home/'+subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="activation('/home/'+subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-s-grid"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menulist: [],
      iconList: [
        'el-icon-s-custom',
        'el-icon-s-release',
        'el-icon-s-goods',
        'el-icon-s-order',
        'el-icon-s-data'
      ],
      judge: false,
      wi: '200px',
      divicon: 'el-icon-s-fold',
      change: 'change1',
      // 被激活的菜单地址
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    sign_out() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    //获取所有的菜单
    getMenuList() {
      this.$http.get('menus').then(result => {
        if (result.data.meta.status != 200)
          return this.$message.error('获取菜单列表失败')
        this.menulist = result.data.data
      })
    },
    cut() {
      this.judge = !this.judge
      if (this.judge) {
        this.divicon = 'el-icon-s-unfold'
        this.wi = '64px'
        this.change = 'change2'
      } else {
        this.divicon = 'el-icon-s-fold'
        this.wi = '200px'
        this.change = 'change1'
      }
    },
    activation(activePath) {
      //向服务器存储被激活的菜单地址
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>
<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color: white;
  div {
    font-size: 20px;
    display: flex;
    align-items: center;
  }
}
.el-aside {
  background-color: #333744;
  transition: 0.4s all;
}
.el-main {
  background-color: #eaedf1;
}
.el-container {
  height: 100%;
}
.el-menu {
  border-right: none;
}
#btn {
  height: 26px;
  background-color: #4a5064;
  cursor: pointer;
  color: white;
  text-align: center;
  font-size: 23px;
  line-height: 26px;
  i {
    transition: 0.2s all;
  }
}
.change1 {
  &:hover i {
    color: turquoise;
    transform: translate(-60%);
  }
}
.change2 {
  &:hover i {
    color: turquoise;
    transform: translate(60%);
  }
}
</style>
