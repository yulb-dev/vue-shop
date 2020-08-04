<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table :data="rightList" stripe border max-height="460">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="角色列表"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == '0'">等级一</el-tag>
            <el-tag type="success" v-else-if="scope.row.level == '1'">等级二</el-tag>
            <el-tag type="warning" v-else>等级三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rightList: []
    }
  },
  methods: {
    getRightList() {
      this.$http.get('/rights').then(result => {
        if (result.data.meta.status != 200)
          return this.$message.error('获取权限列表失败')
        this.rightList = result.data.list
      })
    },
    dialogVisible() {
      this.$http.get('/addq').then(result => {
        console.log(result.data)
      })
    }
  },
  created() {
    this.getRightList()
  }
}
</script>
<style lang="less" scoped>
</style>