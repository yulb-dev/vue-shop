<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @keyup.enter="queryOrders"
            @clear="getOrderList"
            @input="judge"
          >
            <el-button slot="append" icon="el-icon-search" @click="queryOrders"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" stripe max-height="460">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="orderno" label="订单编号" width="200px"></el-table-column>
        <el-table-column prop="orderprice" label="订单价格"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.payment">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deliver" label="是否发货">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.deliver"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="change(scope.row._id,scope.row.deliver)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">{{scope.row.placetime | dateFrm}}</template>
        </el-table-column>
        <el-table-column label="物流信息">
          <template slot-scope="scope">
            <el-button
              type="success"
              icon="el-icon-location-information"
              size="small"
              @click="openTileLine(scope.row.logim)"
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
    </el-card>
    <el-dialog title="物流信息" :visible.sync="timeLineDialog" width="40%">
      <el-timeline reverse>
        <el-timeline-item
          v-for="(item, index) in timeLine"
          :key="index"
          :timestamp="item.timestamp"
        >{{item.content}}</el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="timeLineDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //订单列表
      orderList: [],
      addressSelection: [],
      queryInfo: {
        query: '',
        //当前的页数
        pagenum: 1,
        //当前每页显示多少条数据
        pagesize: 5
      },
      //物流信息
      timeLine: [],
      selectedOptions: [],
      total: 0,
      modifyOrderDialog: false,
      timeLineDialog: false
    }
  },
  methods: {
    getOrderList() {
      this.$http.post('/getOrders', this.queryInfo).then(result => {
        if (result.data.meta.status != 200)
          return this.$message.error('获取订单列表失败')
        this.orderList = result.data.data.orderList
        this.total = result.data.data.total
      })
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    //监听 页码值改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    queryOrders() {
      if (this.queryInfo.query == '') {
        return this.$message.error('请输入有效字符！')
      }
      this.$http.post('/queryOrders', this.queryInfo).then(result => {
        this.orderList = result.data.data.orderList
        this.total = result.data.data.total
      })
    },
    judge() {
      if (this.queryInfo.query == '') this.getOrderList()
    },
    change(id, a) {
      this.$http.post('/deliverChange', { id: id, deliver: a }).then(result => {
        if (result.data.meta.status != 200)
          return this.$message.error('修改失败')
        this.$message.success(result.data.meta.msg)
      })
    },
    openModifyOrderDialog() {
      this.modifyOrderDialog = true
    },
    openTileLine(logim) {
      this.timeLineDialog = true
      this.timeLine = logim
    },
    handleChange() {},
    modifyOrder() {}
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
  },
  created() {
    this.getOrderList()
  }
}
</script>