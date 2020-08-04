<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeLeave"
          @tab-click="getPara"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                v-model="selectedKeys"
                :options="catelist"
                expand-trigger="hover"
                :props="cascaderProps"
                @change="handleChange"
                width="100%"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.name" v-for="item in para.dypara" :key="item.name">
              <el-checkbox-group v-model="item.content">
                <el-checkbox :label="item2" v-for="item2 in item.content" border size="small"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.name" v-for="item in para.staticpro" :key="item.name">
              <el-input v-model="item.content"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="3">
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="addForm.content"
              maxlength="30"
              show-word-limit
              resize="none"
              size="medium"
              :clearable="true"
            ></el-input>
            <el-button type="primary" @click="addGoods" class="mar">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeIndex: '0',
      para: {},
      staPara: {},
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_class: '',
        pathId: '',
        content: '',
        goods_para: {},
        goods_attr: {}
      },
      catelist: [],
      selectedKeys: [],
      //显示规则
      cascaderProps: {
        value: '_id',
        label: 'name',
        children: 'children'
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
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
    beforeLeave(activeName, oldActiveName) {
      if (this.selectedKeys.length == 3) {
        return
      } else {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    getPara() {
      //   if (this.activeIndex == '1') {
      //     this.$http
      //       .post('/getPara', { id: this.selectedKeys[2] })
      //       .then(result => {
      //         this.para = result.data
      //       })
      //   }
      //   if (this.activeIndex == '2') {
      //     this.$http
      //       .post('/getPara', { id: this.selectedKeys[2] })
      //       .then(result => {
      //         this.para = result.data
      //       })
      //   }
    },
    handleChange() {
      this.$http.post('/getPara', { id: this.selectedKeys[2] }).then(result => {
        this.para = result.data
        this.para.staticpro.forEach((item, i1) => {
          this.para.staticpro[i1].content = item.content.join(',')
        })
        return
      })
    },
    addGoods() {
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          this.addForm.pathId = this.selectedKeys[2]
          this.addForm.goods_para = this.para.dypara
          this.addForm.goods_attr = this.para.staticpro
          this.$http.post('/addGoods', this.addForm).then(result => {
            if (result.data.status != 200) {
              return this.$message.error('添加商品失败')
            }
            this.$router.push('/home/productList')
            this.$message.success(result.data.msg)
          })
        } else {
          this.$message.error('请填写必要信息')
          return false
        }
      })
    }
  },
  created() {
    this.getCatelist()
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 5px 0 5px !important;
}
.el-form-item {
  padding: 0 !important;
}
.mar {
  margin-top: 15px;
}
</style>