<template>
  <el-form>
    <el-form-item label="用户名">
      <el-input v-model.trim="user.username" />
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model.trim="user.password" />
    </el-form-item>
    <el-form-item label="Email">
      <el-input v-model.trim="user.email" />
    </el-form-item>
    <el-form-item label="手机号">
      <el-input v-model.trim="user.phone" />
    </el-form-item>
    <el-form-item label="头像">
      <el-input v-model.trim="user.avatar" placeholder="请填写头像图片url" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">更新</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateInfo } from '@/api/user'

export default {
  props: {
    user: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      temp: {}
    }
  },
  methods: {
    // 更新个人信息
    submit() {
      this.loading = true
      this.temp = this.user
      updateInfo(this.temp).then(response => {
        if (response.code === 20000) {
          this.$message({
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        }
      }).catch(() => {
        setTimeout(() => {
          this.loading = false
        }, 3000)
      })
    }
  }
}
</script>
