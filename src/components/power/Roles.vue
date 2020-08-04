<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary" @click="addRoleDialogVisible = true">添加角色</el-button>
      <el-table :data="rolelist" stripe border max-height="440">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item,i1) in scope.row.children" :key="item._id" class="center">
              <!-- //一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="open1(i1,scope.row._id,scope.row)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <el-row v-for="(item2,i2) in item.children" :key="item2._id">
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="open2(i1,i2,scope.row._id,scope.row)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="(item3,i3) in item2.children"
                      :key="item3._id"
                      type="warning"
                      closable
                      @close="open(i1,i2,i3,scope.row._id,scope.row)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="rolename" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="small" @click="eject(scope.row)">编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="open3(scope.row._id)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="small"
              @click="getrightslist(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightdialogVisible" width="40%" @close="dialogClose">
      <el-tree
        :data="rightslist"
        :props="defaultProps"
        show-checkbox
        default-expand-all
        node-key="authName"
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRight">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="40%"
      ref="roleForm"
      @close="clear"
    >
      <el-form :model="roleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="角色名称" prop="rolename">
          <el-input v-model="roleForm.rolename"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoleDialogVisible"
      width="40%"
      ref="editRoleDialog"
      @close="clear1"
    >
      <el-form :model="roleForm" :rules="rules" ref="editRoleForm" label-width="100px">
        <el-form-item label="角色名称" prop="rolename">
          <el-input v-model="roleForm.rolename"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole('editRoleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rolelist: [],
      rightslist: [],
      setRightdialogVisible: false,
      addRoleDialogVisible: false,
      editRoleDialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleForm: {
        rolename: '',
        roleDesc: ''
      },
      defKeys: [],
      roleId: '',
      editRoleId: '',
      rules: {
        rolename: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    dialogVisible() {
      this.$http.get('/getRoles').then(result => {
        this.rolelist = result.data
      })
    },
    open(i1, i2, i3, id, role) {
      this.$confirm('此操作将永久删除该, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.post('/delRole', { i1, i2, i3, id }).then(result => {
            // this.dialogVisible()
            role.children = result.data.children
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    open1(i1, id, role) {
      this.$confirm('此操作将永久删除该, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.post('/delRole1', { i1, id }).then(result => {
            // this.dialogVisible()
            role.children = result.data.children
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    open2(i1, i2, id, role) {
      this.$confirm('此操作将永久删除该, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.post('/delRole2', { i1, i2, id }).then(result => {
            // this.dialogVisible()
            role.children = result.data.children
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    getrightslist(role) {
      this.roleId = role._id
      this.$http.get('/getrightslist').then(result => {
        this.rightslist = result.data
        role.children.forEach(item => {
          item.children.forEach(item1 => {
            item1.children.forEach(item2 => {
              this.defKeys.push(item2.authName)
            })
          })
        })
        this.setRightdialogVisible = true
      })
    },
    allotRight() {
      var list = [
        ...this.$refs.treeRef.getCheckedNodes(),
        ...this.$refs.treeRef.getHalfCheckedNodes()
      ]
      var list2 = []
      var index = 0
      var index1 = 0
      var index2 = 0
      var index3 = 0
      var index4 = 0
      list.forEach((item, i1) => {
        if (item.level === '0') {
          list2.push(item)
          list2[index].children = []
          if (item.path == 'goods') {
            list.forEach((item2, i2) => {
              if (
                item2.level == '1' &&
                (item2.path == 'goods' ||
                  item2.path == 'params' ||
                  item2.path == 'categories')
              ) {
                list[i1].children.push(item2)
                list[i1].children[index1].children = []
                if (item2.path == 'goods') {
                  list.forEach(item3 => {
                    if (item3.level == '2' && item3.path == 'goods')
                      list[i1].children[index1].children.push(item3)
                  })
                  index1++
                } else if (item2.path == 'params') {
                  list.forEach(item3 => {
                    if (item3.level == '2' && item3.path == 'params')
                      list[i1].children[index1].children.push(item3)
                  })
                  index1++
                } else if (item2.path == 'categories') {
                  list.forEach(item3 => {
                    if (item3.level == '2' && item3.path == 'categories')
                      list[i1].children[index1].children.push(item3)
                  })
                  index1++
                }
              }
            })
          } else if (item.path == 'orders') {
            list.forEach((item2, i2) => {
              if (item2.level == '1' && item2.path == 'orders') {
                list[i1].children.push(item2)
                list[i1].children[index2].children = []
                if (item2.path == 'orders') {
                  list.forEach(item3 => {
                    if (item3.level == '2' && item3.path == 'orders')
                      list[i1].children[index2].children.push(item3)
                  })
                  index2++
                }
              }
            })
          } else if (item.path == 'rights') {
            list.forEach((item2, i2) => {
              if (
                item2.level == '1' &&
                (item2.path == 'roles' || item2.path == 'rights')
              ) {
                list[i1].children.push(item2)
                list[i1].children[index3].children = []
                if (item2.path == 'roles') {
                  list.forEach(item3 => {
                    if (item3.level == '2' && item3.path == 'roles')
                      list[i1].children[index3].children.push(item3)
                  })
                  index3++
                } else if (item2.path == 'rights') {
                  list.forEach(item3 => {
                    if (item3.level == '2' && item3.path == 'rights')
                      list[i1].children[index3].children.push(item3)
                  })
                  index3++
                }
              }
            })
          } else if (item.path == 'users') {
            list.forEach((item2, i2) => {
              if (item2.level == '1' && item2.path == 'users') {
                list[i1].children.push(item2)
                list[i1].children[index4].children = []
                if (item2.path == 'users') {
                  list.forEach(item3 => {
                    if (item3.level == '2' && item3.path == 'users')
                      list[i1].children[index4].children.push(item3)
                  })
                  index4++
                }
              }
            })
          }
          index++
        }
      })
      // list.forEach(item1 => {
      //   if (item1.level === '1') {
      //     this.rightslist.forEach(item2 => {})
      //   }
      // })
      this.$http
        .post('/assignPermissions', { id: this.roleId, list2 })
        .then(result => {
          this.$message.success('分配权限成功')
          this.setRightdialogVisible = false
          this.dialogVisible()
        })
    },
    dialogClose() {
      this.defKeys = []
    },
    addRole(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http.post('/addRole', this.roleForm).then(result => {
            if (result.data.meta.status != 200) {
              return this.$message.error(result.data.meta.msg)
            }
            this.dialogVisible()
            this.$message.success(result.data.meta.msg)
            this.addRoleDialogVisible = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    clear() {
      this.$refs.ruleForm.resetFields()
    },
    clear1() {
      this.$refs.editRoleForm.resetFields()
      this.roleForm = {
        rolename: '',
        roleDesc: ''
      }
    },
    eject(role) {
      this.editRoleDialogVisible = true
      this.editRoleId = role._id
      this.roleForm = {
        rolename: role.rolename,
        roleDesc: role.roleDesc
      }
    },
    editRole(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http
            .post('/editRole', { id: this.editRoleId, role: this.roleForm })
            .then(result => {
              if (result.data.meta.status != 200) {
                return this.$message.error(result.data.meta.msg)
              }
              this.dialogVisible()
              this.$message.success(result.data.meta.msg)
              this.editRoleDialogVisible = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    open3(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.post('/delRole3', { id: id }).then(result => {
            if (result.data.meta.status != 200) {
              return this.$message({
                type: 'info',
                message: result.data.meta.msg
              })
            }
            this.dialogVisible()
            this.$message({
              type: 'success',
              message: result.data.meta.msg
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  created() {
    this.dialogVisible()
  }
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.el-row {
  border-bottom: 1px rgb(214, 214, 214) solid;
}
.center {
  display: flex;
  align-items: center;
}
</style>