<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="提交脚本" :rules="rules">
        <el-input placeholder="请提交jmx格式文件" v-model="textarea" style="width: 50%">
          <el-button slot="append" icon="el-icon-folder-opened" @click="openFile"></el-button>
        </el-input>
        <input type="file" name="filename" id="open" style="display: none" @change="changeFile"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="uploadFile()">上传到服务器</el-button>
      </el-form-item>
      <el-form-item label="运行脚本" :rules="rules">
        <el-input v-model="form.scriptPath" placeholder="输入脚本绝对路径 如/home/scripts/demo.jmx" style="width: 50%"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="runScript()">运行</el-button>
      </el-form-item>
      <el-form-item label="运行日志">
        <div class="console" v-html="html" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { run, upload } from '@/api/script'
import AnsiUp from 'ansi_up'
export default {
  data() {
    return {
      textarea: "",
      file: "",
      ansi: undefined, // 执行脚本后展示的日志
      userId: undefined, // WebSocket的url
      content: '', // 日志内容
      scriptLocalPath: '', // 脚本本地路径
      form: {
        userId: '',
        scriptPath: ''
      },
      rules: [
        { required: true, message: '脚本路径不能为空' }
      ],
      loading: true
    }
  },
  computed: {
    html() {
      return this.ansi.ansi_to_html(this.content).replace(/\n/gm, '<br>')
    }
  },
  beforeMount() {
    this.ansi = new AnsiUp()
  },
  mounted() {
    this.initWebSocket()
  },
  destroyed: function() {
    this.closeWebSocket()
  },
  updated() {
    // 每次页面渲染完之后滚动条在最底部
    this.$nextTick(() => {
      const container = this.$el.querySelector('.console')
      container.scrollTop = container.scrollHeight
    })
  },
  methods: {
    initWebSocket: function() {
      this.userId = JSON.parse(sessionStorage.getItem('userInfo')).id
      this.websocket = new WebSocket('ws://localhost:9123/websocket/' + this.userId) // 建立连接
      this.websocket.onopen = this.openWebSocket
      this.websocket.onerror = this.errorWebSocket
      this.websocket.onmessage = this.messageWebSocket
      this.websocket.onclose = this.closeWebSocket
    },
    // 连接成功后调用
    openWebSocket: function() {
      console.log('WebSocket连接成功')
    },
    // 发生错误时调用
    errorWebSocket: function(e) {
      console.log('WebSocket连接发生错误')
    },
    // 接收后端消息
    messageWebSocket: function(e) {
      this.content += e.data
    },
    // 关闭连接
    closeWebSocket: function(e) {
      console.log('connection closed (' + e.code + ')')
    },
    // 选择文件
    openFile() {
      document.getElementById("open").click();
    },
    // 转换文件
    changeFile(event) {
      let file = event.target.files[0]; //获取上传的文件
      this.file = file
      this.textarea = file.name
    },
    // 上传文件
    uploadFile() {
      this.loading = true
      let formData = new FormData()
      formData.append('file', this.file)
      this.$confirm('确认上传此脚本?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        upload(formData).then(response => {
          if (response.code === 20000) {
              this.$message({
                  message: '脚本上传成功!',
                  type: 'success'
              })
          } else {
              this.$message({
                  message: '脚本上传失败!',
                  type: 'error'
              })
          }
        }).catch(() => {
          setTimeout(() => {
            this.loading = false
          }, 1000)
        })
      })
    },
    runScript() {
      this.loading = true
      this.$confirm('该脚本将被执行, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.ansi = new AnsiUp() // 每次执行前初始化
        run(this.form).then(response => {
          this.$message({
            message: '脚本正在运行,请稍后!',
            type: 'success'
          })
        }).catch(() => {
          setTimeout(() => {
            this.loading = false
          }, 1000)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.console {
  height: 470px;
  font-family: "微软雅黑";
  font-size: 14px;
  font-weight: bold;
  text-align: left;
  background-color: #121212;
  color: rgba(255, 255, 255, 60%);
  overflow-y: auto;
  padding: 5px 20px;
}
.line{
  text-align: center;
}
</style>
