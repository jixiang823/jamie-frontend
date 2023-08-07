<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="corn表达式">
        <el-input v-model="form.corn" placeholder="0 0 1 * * ?  每天凌晨1点执行一次"></el-input>
      </el-form-item>
      <el-form-item label="启用定时任务">
        <el-switch v-model="form.status"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { startTask, stopTask, restartTask, queryTask } from '@/api/scheduled'

export default {
  data() {
    return {
      // 展示的数据
      form: {
        corn: '',
        status: false
      },
      // 提交的数据
      temp: {
        corn: '',
        status: false
      },
      // 判断定时任务是否存在(首次进页面肯定是不存在的,true表示不存在)
      taskNotExist: true,
      loading: true
    }
  },
  created() {
    this.getScheduledTask()
  },
  methods: {
    getScheduledTask() {
      this.loading = true
      queryTask().then(response => {
        this.form.corn = response.data.corn
        const code = response.data.status
        if (this.form.corn === null || code === null) {
          this.taskNotExist = true
          this.form.status = null
        }
        if (code === 1) {
          this.taskNotExist = false
          this.form.status = true
        }
        if (code === 2) {
          this.taskNotExist = false
          this.form.status = false
        }
        if (code === 3) {
          this.taskNotExist = false
          this.form.status = true
        }
        this.loading = false
      }).catch(
        setTimeout(() => {
          this.loading = false
        }, 3000)
      )
    },
    onSubmit() {
      // form是表单的参数(比如接口获取数据后展示在页面,以及对表单数据做修改后提交,这些都是form)
      // 为了与form区分,最终提交给后端的参数用temp表示.
      // corn的非空校验由后端判断
      this.loading = true
      this.temp.corn = this.form.corn
      this.temp.status = this.form.status
      // 任务从未被创建的情况
      if (this.taskNotExist === true) {
        // status非空校验,若为空则赋默认值为false
        if (this.temp.status === null) {
          this.temp.status = false
        }
        // 创建任务
        startTask(this.temp).then(() => {
          this.$message({
            message: '定时任务已启动',
            type: 'success',
            duration: 2000
          })
          this.taskNotExist = false // 将任务标记为'已存在'
        }).catch(
          setTimeout(() => {
            this.loading = false
          }, 3000)
        )
      }
      // 任务已存在的情况
      if (this.taskNotExist === false) {
        // 停止任务
        if (this.temp.status === false) {
          stopTask().then(() => {
            this.$message({
              message: '定时任务已停止',
              type: 'success',
              duration: 2000
            })
          }).catch(
            setTimeout(() => {
              this.loading = false
            }, 3000)
          )
        }
        // 重启任务
        if (this.temp.status === true) {
          restartTask(this.temp).then(() => {
            this.$message({
              message: '定时任务已更新',
              type: 'success',
              duration: 2000
            })
          }).catch(
            setTimeout(() => {
              this.loading = false
            }, 3000)
          )
        }
      }
    }
  }
}
</script>
