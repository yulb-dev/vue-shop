<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="openAddCfDialog">添加分类</el-button>
      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <template slot="judge" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.deleted"></i>
          <i class="el-icon-error" v-else></i>
        </template>
        <template slot="grade" slot-scope="scope">
          <el-tag v-if="scope.row.level == '0'">一级</el-tag>
          <el-tag v-else-if="scope.row.level == '1'" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <template slot="caozuo" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            class="reMargin"
            @click="openEditDialog(scope.row)"
          >编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            class="reMargin"
            @click="delImcf(scope.row)"
          >删除</el-button>
        </template>
      </tree-table>
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
    <el-dialog title="添加分类" :visible.sync="addCfDialog" width="35%" @close="qkAddCfform">
      <el-form :model="Cfim" :rules="rules" ref="ruleForm">
        <el-form-item label="角色名称：" prop="name">
          <el-input v-model="Cfim.name"></el-input>
        </el-form-item>
        <el-form-item label="父类分级：">
          <el-cascader
            v-model="selectedKeys"
            :options="djList"
            expand-trigger="hover"
            :props="cascaderProps"
            @change="handleChange"
            width="100%"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCfDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCf">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑" :visible.sync="editDialog" width="40%" ref="editDialog">
      <el-form :model="newImcf" :rules="rules" ref="editDialog">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="newImcf.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editImcf">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //商品分类的数据列表
      catelist: [],
      djList: [],
      delId: '',
      //修改的姓名
      newImcf: {
        name: '',
        id: ''
      },
      queryInfo: {
        pagenum: 1,
        pagesize: 5
      },
      //添加的分类名
      selectedKeys: [],
      //添加的分类数据
      Cfim: {
        name: '',
        level: '',
        psth: '',
        path2: ''
      },
      //数据总条数
      total: 0,
      //为table指定列的名称
      columns: [
        {
          label: '分类名称',
          prop: 'name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'judge'
        },
        {
          label: '等级',
          type: 'template',
          template: 'grade'
        },
        {
          label: '操作',
          type: 'template',
          template: 'caozuo'
        }
      ],
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ]
      },
      addCfDialog: false,
      editDialog: false,
      cascaderProps: {
        value: '_id',
        label: 'name',
        children: 'children'
      }
    }
  },
  methods: {
    //监听handleSizeChange改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCatelist()
    },
    //监听 页码值改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCatelist()
    },
    getCatelist() {
      this.$http.post('/getCatelist', this.queryInfo).then(result => {
        this.catelist = result.data.catelist
        this.total = result.data.total
      })
    },
    openAddCfDialog() {
      this.$http.get('/getdjList').then(result => {
        this.djList = result.data
        this.addCfDialog = true
      })
    },
    handleChange(value) {
      this.judge = true
    },
    qkAddCfform() {
      this.Cfim.name = ''
      this.selectedKeys = []
    },
    addCf() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$http
            .post('/addCfDialog', {
              name: this.Cfim.name,
              id: this.selectedKeys
            })
            .then(result => {
              if (result.data.status != 200) {
                return this.$message.error(result.data.msg)
              }
              this.getCatelist()
              this.$message.success(result.data.msg)
              this.addCfDialog = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    openEditDialog(imcf) {
      this.newImcf.name = imcf.name
      this.newImcf.id = imcf._id
      this.editDialog = true
    },
    editImcf() {
      this.$refs.editDialog.validate(valid => {
        if (valid) {
          this.$http.post('/editDialog', this.newImcf).then(result => {
            if (result.data.status != 200) {
              return this.$message.error(result.data.msg)
            }
            this.getCatelist()
            this.$message.success(result.data.msg)
            this.editDialog = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    delImcf(im) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.post('/delImcf', im).then(result => {
            if (result.data.status != 200) {
              return this.$message.error(result.data.msg)
            }
            this.getCatelist()
            this.$message({
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
    }
  },
  created() {
    this.getCatelist()
  }
}
</script>
<style lang="less" scoped>
.el-button {
  margin-bottom: 15px;
}
.reMargin {
  margin: 0;
}
.yh {
  display: flex;
}
</style>