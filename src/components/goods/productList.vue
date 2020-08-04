<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @keyup.enter="queryGoods"
            @clear="getGoods_list"
            @input="judge"
          >
            <el-button slot="append" icon="el-icon-search" @click="queryGoods"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="toAddPage">添加商品</el-button>
        </el-col>
        <el-table :data="goods_list" stripe max-height="460">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <h2>动态参数：</h2>
              <el-row v-for="item in scope.row.goods_para" :key="item.name" class="padd">
                <el-col :span="3">
                  <h3>{{ item.name }}：</h3>
                </el-col>
                <el-col :span="3" v-for="item2 in item.content" :key="item2">
                  <el-tag>{{ item2 }}</el-tag>
                </el-col>
              </el-row>
              <h2 class="mar">静态属性：</h2>
              <el-row v-for="item in scope.row.goods_attr" :key="item.name" class="padd">
                <el-col :span="3">
                  <h3>{{ item.name }}：</h3>
                </el-col>
                <el-col :span="5">
                  <p>{{ item.content }}</p>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="goods_name" label="商品名称"></el-table-column>
          <el-table-column prop="goods_price" label="商品价格"></el-table-column>
          <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
          <el-table-column label="创建时间">
            <template slot-scope="scope">{{scope.row.create_time | dateFrm }}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                size="small"
                @click="openModifyGoodsDialog(scope.row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                size="small"
                @click="delGoods(scope.row._id)"
              ></el-button>
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
      </el-row>
    </el-card>
    <el-dialog title="修改商品" :visible.sync="modifyGoodsDialog" width="40%">
      <el-form :model="goods" :rules="modifyGoodsRules" ref="modifyGoods" label-width="80px">
        <el-form-item label="商品名称">
          <el-input v-model="goods.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input v-model="goods.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input v-model="goods.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyGoodsDialog = false">取 消</el-button>
        <el-button type="primary" @click="modifyGoods">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //商品列表
      queryInfo: {
        query: '',
        //当前的页数
        pagenum: 1,
        //当前每页显示多少条数据
        pagesize: 5
      },
      //修改的商品信息
      goods: {
        goods_name: '',
        goods_price: '',
        goods_weight: ''
      },
      total: 0,
      goods_list: [],
      value: '',
      dialogVisible: false,
      modifyGoodsDialog: false,
      modifyGoodsRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入有效值', trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ],
        weight: [
          { required: true, message: '请输入有效值', trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getGoods_list() {
      this.$http.post('/getGoods_list', this.queryInfo).then(result => {
        if (result.data.meta.status != 200)
          return this.$message.error('获取用户数据失败')
        this.goods_list = result.data.data.goods_list
        this.total = result.data.data.total
      })
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoods_list()
    },
    //监听 页码值改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoods_list()
    },
    queryGoods() {
      if (this.queryInfo.query == '') {
        return this.$message.error('请输入有效字符！')
      }
      this.$http.post('/queryGoods', this.queryInfo).then(result => {
        this.goods_list = result.data.data.Goods
        this.total = result.data.data.total
      })
    },
    judge() {
      if (this.queryInfo.query == '') this.getGoods_list()
    },
    openModifyGoodsDialog(Goods) {
      this.goods = Goods
      this.modifyGoodsDialog = true
    },
    modifyGoods(Goods) {
      this.$refs.modifyGoods.validate(valid => {
        if (valid) {
          this.$http.post('/modifyGoods', this.goods).then(result => {
            if (result.data.meta.status != 200) {
              return this.$message.error(result.data.meta.msg)
            }
            this.$message.success(result.data.meta.msg)
            this.getGoods_list()
            this.modifyGoodsDialog = false
            this.$refs.modifyGoods.resetFields()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    delGoods(id) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.post('/delgoods', { id: id }).then(result => {
            this.$message({
              type: 'success',
              message: result.data.meta.msg
            })
            this.getGoods_list()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    toAddPage() {
      this.$router.push('/home/productList/add')
    }
  },
  created() {
    this.getGoods_list()
  },
  filters: {
    dateFrm(time) {
      var time1 = new Date(time)
      var y = time1.getFullYear()
      var n = time1.getMonth() + 1
      var d = time1.getDate()
      var h = time1.getHours()
      var m = time1.getMinutes()
      return `${y}-${n}-${d} ${h}:${m}`
    }
  }
}
</script>

<style lang="less" scoped>
.padd {
  padding: 10px 0;
  margin-left: 20px;
  border-bottom: 1px solid rgb(179, 179, 179);
}
.mar {
  margin-top: 20px;
}
</style>