<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意！只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>
      <el-row>
        <el-col>
          <span>请选择商品分类：</span>
          <el-cascader
            v-model="selectedKeys"
            :options="catelist"
            expand-trigger="hover"
            :props="cascaderProps"
            @change="handleChange"
            width="100%"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="first">
          <el-button type="primary" @click="openAddDyParaDialog" :disabled="isBtnDisabled">添加参数</el-button>
          <el-table :data="paraIm.dypara" style="width: 100%" stripe border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="tag"
                  v-for="(tag,index) in scope.row.content"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(scope.$index,index)"
                >{{tag}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.$index)"
                  @blur="handleInputConfirm(scope.$index)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="small"
                  @click="openEditParaDialog(scope.$index,scope.row.name)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="small"
                  @click="openDelParaDialog(scope.$index)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="second">
          <el-button type="primary" @click="openAddStaParaDialog" :disabled="isBtnDisabled">添加属性</el-button>
          <el-table :data="paraIm.staticpro" style="width: 100%" stripe border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="tag"
                  v-for="(tag,index) in scope.row.content"
                  closable
                  :disable-transitions="false"
                  @close="handleClose1(scope.$index,index)"
                >{{tag}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm1(scope.$index)"
                  @blur="handleInputConfirm1(scope.$index)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="small"
                  @click="openEditParaDialog1(scope.$index,scope.row.name)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="small"
                  @click="openDelParaDialog1(scope.$index)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog title="修改静态属性" :visible.sync="editStaParaDialogVisible" width="40%">
      <el-form
        :model="dyPara"
        :rules="rules"
        ref="StaParaDialogVisible"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="静态属性" prop="name">
          <el-input v-model="dyPara.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editStaParaDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editStaPara">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改动态参数" :visible.sync="editParaDialogVisible" width="40%">
      <el-form
        :model="dyPara"
        :rules="rules"
        ref="editParaDialogVisible"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="动态参数" prop="name">
          <el-input v-model="dyPara.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParaDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPara">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="添加静态属性" :visible.sync="addStaParaDialog" width="40%">
      <el-form
        :model="dyPara"
        :rules="rules"
        ref="openAddStaParaDialog"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="静态属性" prop="name">
          <el-input v-model="dyPara.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addStaParaDialog = false">取 消</el-button>
        <el-button type="primary" @click="addStaPara">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="添加动态参数" :visible.sync="addDyParaDialog" width="40%">
      <el-form
        :model="dyPara"
        :rules="rules"
        ref="openAddDyParaDialog"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="动态参数" prop="name">
          <el-input v-model="dyPara.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDyParaDialog = false">取 消</el-button>
        <el-button type="primary" @click="addPara">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      catelist: [],
      //选中的分类的 ID
      selectedKeys: [],
      //参数信息
      paraIm: {},
      activeName: 'first',
      //显示规则
      cascaderProps: {
        value: '_id',
        label: 'name',
        children: 'children'
      },
      dyParaIndex: 0,
      inputVisible: false,
      editParaDialogVisible: false,
      editStaParaDialogVisible: false,
      addDyParaDialog: false,
      addStaParaDialog: false,
      inputValue: '',
      dyPara: {
        name: '',
        staticpro: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          { min: 2, max: 6, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getCatelist() {
      this.$http.get('/getFllist').then(result => {
        this.catelist = result.data.list
      })
    },
    handleChange() {
      if (this.selectedKeys.length == 3) {
        this.$http
          .post('/getPara', { id: this.selectedKeys[2] })
          .then(result => {
            this.paraIm = result.data
          })
      } else this.paraIm = {}
    },
    handleClick(tab, event) {
      // console.log(tab, event)
    },
    //打开添加动态参数对话框
    openAddDyParaDialog() {
      this.dyPara.name = ''
      this.addDyParaDialog = true
    },
    //打开添加静态参数对话框
    openAddStaParaDialog() {
      this.dyPara.name = ''
      this.addStaParaDialog = true
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm(i) {
      let inputValue = this.inputValue
      if (inputValue) {
        this.paraIm.dypara[i].content.push(this.inputValue)
        this.$http.post('/delLabel', this.paraIm).then(result => {
          return this.$message.success('添加标签成功！')
        })
      } else {
        this.$message.info('未输入有效值')
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    handleClose(i1, i2) {
      this.paraIm.dypara[i1].content.splice(i2, 1)
      this.$http.post('/delLabel', this.paraIm).then(result => {
        return this.$message.success('删除成功！')
      })
    },
    //打开编辑动态参数对话框
    openEditParaDialog(i, name) {
      this.editParaDialogVisible = true
      this.dyParaIndex = i
      this.dyPara.name = name
    },
    //打开删除动态参数对话框
    openDelParaDialog(i) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.paraIm.dypara.splice(i, 1)
          this.$http.post('/delLabel', this.paraIm).then(result => {
            return this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    //打开删除静态参数对话框
    openDelParaDialog1(i) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.paraIm.staticpro.splice(i, 1)
          this.$http.post('/delLabel', this.paraIm).then(result => {
            return this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    editPara() {
      this.$refs.editParaDialogVisible.validate(valid => {
        if (valid) {
          this.paraIm.dypara[this.dyParaIndex].name = this.dyPara.name
          this.$http.post('/delLabel', this.paraIm).then(result => {
            this.editParaDialogVisible = false
            return this.$message.success('修改动态参数成功！')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addPara() {
      this.$refs.openAddDyParaDialog.validate(valid => {
        if (valid) {
          this.paraIm.dypara.push({ name: this.dyPara.name, content: [] })
          this.$http.post('/delLabel', this.paraIm).then(result => {
            this.addDyParaDialog = false
            return this.$message.success('添加动态参数成功！')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addStaPara() {
      this.$refs.openAddStaParaDialog.validate(valid => {
        if (valid) {
          this.paraIm.staticpro.push({ name: this.dyPara.name, content: [] })
          this.$http.post('/delLabel', this.paraIm).then(result => {
            this.addStaParaDialog = false
            return this.$message.success('添加静态属性成功！')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleClose1(i1, i2) {
      this.paraIm.staticpro[i1].content.splice(i2, 1)
      this.$http.post('/delLabel', this.paraIm).then(result => {
        return this.$message.success('删除成功！')
      })
    },
    handleInputConfirm1(i) {
      let inputValue = this.inputValue
      if (inputValue) {
        this.paraIm.staticpro[i].content.push(this.inputValue)
        this.$http.post('/delLabel', this.paraIm).then(result => {
          return this.$message.success('添加标签成功！')
        })
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    openEditParaDialog1(i, name) {
      this.editStaParaDialogVisible = true
      this.dyParaIndex = i
      this.dyPara.name = name
    },
    editStaPara() {
      this.$refs.StaParaDialogVisible.validate(valid => {
        if (valid) {
          this.paraIm.staticpro[this.dyParaIndex].name = this.dyPara.name
          this.$http.post('/delLabel', this.paraIm).then(result => {
            this.editStaParaDialogVisible = false
            return this.$message.success('修改静态属性成功！')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  created() {
    this.getCatelist()
  },
  computed: {
    //计算
    isBtnDisabled() {
      if (this.paraIm._id) {
        return false
      }
      return true
    }
  }
}
</script>
<style lang="less" scoped>
.el-row {
  margin: 10px 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
</style>