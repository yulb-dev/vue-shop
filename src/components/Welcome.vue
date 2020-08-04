<template>
  <div>
    <h1>{{msg}}</h1>
  </div>
</template>
<script>
export default {
  data() {
    return {
      msg: '欢迎来到，电商后台管理系统！'
    }
  },
  methods: {
    zmd() {
      setInterval(
        function() {
          var first = this.msg.substring(0, 1)
          var last = this.msg.substring(1)
          this.msg = last + first
        }.bind(this),
        300
      )
    }
  },
  mounted() {
    this.zmd()
  }
}
</script>

<style lang="less" scoped>
div {
  height: 100%;
  position: relative;
  background: url('../assets/bg.png') no-repeat center center;
}
h1 {
  font-size: 40px;
  color: #4f4f2f;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -30%);
}
</style>