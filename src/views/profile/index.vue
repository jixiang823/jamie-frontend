<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="12" :xs="6">
        <account :user="user" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Account from './components/Account'
import { getInfo } from '@/api/user'

export default {
  name: 'Profile',
  components: { Account },
  data() {
    return {
      user: {},
      loading: true
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.loading = true
      getInfo().then(response => {
        this.user = response.data
        this.loading = false
      }).catch(
        setTimeout(() => {
          this.loading = false
        }, 3000)
      )
    }
  }
}
</script>
