<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-input
              placeholder="请输入内容"
              class="input-with-select"
              v-model="queryInfo.query"
              clearable
              @keyup.enter="queryUsers"
              @clear="getUserList"
              @input="judge"
            >
              <el-button slot="append" icon="el-icon-search" @click="queryUsers"></el-button>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table :data="userlist" stripe max-height="460">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <!-- 作用域插槽，可以访问到这一行的所有数据 -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="small"
              @click="modifyuser(scope.row._id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="small"
              @click="open(scope.row._id)"
            ></el-button>
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                circle
                size="small"
                @click="assignRolesDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="40%" @close="ruleFormDialogClosed">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" type="email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改用户信息" :visible.sync="modify" width="40%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="rules" ref="modify" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" type="email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modify = false">取 消</el-button>
        <el-button type="primary" @click="submitForm_modify">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="角色分配" :visible.sync="assign" width="40%" @close="role_name = '' ">
      <p>用户名：{{ userIm.username }}</p>
      <p>角色：{{ userIm.role_name }}</p>
      <el-select v-model="role_name" placeholder="请选择" @change="optSelct = true">
        <el-option
          v-for="item in roleList"
          :key="item._id"
          :label="item.rolename"
          :value="item.rolename"
        ></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assign = false">取 消</el-button>
        <el-button type="primary" @click="assignRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkMobile = (rule, value, callback) => {
      var myreg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (!myreg.test(value)) {
        return callback(new Error('请输入正确手机号'))
      } else {
        callback()
      }
    }
    return {
      roleId: '',
      role_name: '',
      roleList: [],
      ruleForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      userIm: {
        username: '',
        role_name: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: 'blur'
          }
        ],
        mobile: [{ required: true, validator: checkMobile, trigger: 'blur' }]
      },
      userlist: [],
      total: 0,
      //获取用户列表的参数对象
      queryInfo: {
        query: '',
        //当前的页数
        pagenum: 1,
        //当前每页显示多少条数据
        pagesize: 2
      },
      dialogVisible: false,
      modify: false,
      assign: false,
      optSelct: false
    }
  },
  methods: {
    getUserList() {
      this.$http.post('/users', this.queryInfo).then(result => {
        if (result.data.meta.status != 200)
          return this.$message.error('获取用户数据失败')
        this.userlist = result.data.data.users
        this.total = result.data.data.total
      })
    },
    //监听handleSizeChange改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    //监听 页码值改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    userStateChanged(im) {
      this.$http.post('/changeStatus', { im }).then(result => {
        if (result.data.meta.status != 200) {
          im.status = !im.status
          return this.$message.error('更新用户状态失败！')
        }
        this.$message.success('更新用户状态成功！')
      })
    },
    queryUsers() {
      if (this.queryInfo.query == '') {
        return this.$message.error('请输入有效字符！')
      }
      this.$http.post('/queryUsers', this.queryInfo).then(result => {
        this.userlist = result.data.data.users
        this.total = result.data.data.total
      })
    },
    judge() {
      if (this.queryInfo.query == '') this.getUserList()
    },
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$http.post('/addUser', this.ruleForm).then(result => {
            if (result.data.meta.status != 200) {
              return this.$message.error(result.data.meta.msg)
            }
            this.$message.success(result.data.meta.msg)
            this.getUserList()
            this.dialogVisible = false
            this.$refs.ruleForm.resetFields()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    modifyuser(id) {
      this.$http.post('/modiftUser', { id }).then(result => {
        this.editForm.username = result.data.username
        this.editForm.email = result.data.email
        this.editForm.mobile = result.data.mobile
        this.modify = true
      })
    },
    submitForm_modify() {
      this.$refs.modify.validate(valid => {
        if (valid) {
          this.$http.post('/modifycc', this.editForm).then(result => {
            if (result.data.meta.status != 200) {
              return this.$message.error(result.data.meta.msg)
            }
            this.getUserList()
            this.$message.success(result.data.meta.msg)
            this.modify = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    editDialogClosed() {
      this.$refs.modify.resetFields()
    },
    editAssignRolesDialogClosed() {
      this.$refs.assignRoles.resetFields()
    },
    ruleFormDialogClosed() {
      this.$refs.ruleForm.resetFields()
    },
    open(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.post('/deluser', { id }).then(result => {
            this.$message({
              type: 'success',
              message: result.data.meta.msg
            })
            this.getUserList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    assignRolesDialog(role) {
      this.optSelct = false
      this.role_name = role.role_name
      this.$http.get('/getRoleNameList').then(result => {
        this.roleList = result.data
        this.roleId = role._id
        this.assign = true
        this.userIm = {
          username: role.username,
          role_name: role.role_name
        }
      })
    },
    assignRoles() {
      if (this.optSelct) {
        this.$http
          .post('/modifyRole', { role_name: this.role_name, id: this.roleId })
          .then(result => {
            if (result.data.meta.status != 200) {
              return this.$message.error(result.data.meta.msg)
            }
            this.getUserList()
            this.assign = false
            return this.$message.success(result.data.meta.msg)
          })
      } else {
        this.assign = false
        return this.$message.info('未分配权限')
      }
    }
  },
  created() {
    this.getUserList()
  }
}
</script>
<style lang="less" scoped>
.el-form-item {
  margin-left: 0 !important;
}
p {
  font-size: 18px;
  padding: 6px 4px;
  // font-weight: bold;
  border-bottom: 1px dashed rgb(166, 177, 187);
}
.el-select {
  margin-top: 6px;
}
</style>