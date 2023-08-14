<template>
  <div class="login-container">
    <el-form ref="registerForm" :model="registerForm" class="login-form">
      <el-form-item prop="username1">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input ref="username" v-model="registerForm.username" placeholder="用户名" type="text" tabindex="1" />
      </el-form-item>
      <el-tooltip v-model="capsTooltip" content="大写锁定已打开" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input :key="passwordType" ref="password" v-model="registerForm.password" :type="passwordType" placeholder="密码" tabindex="2" autocomplete="on" @keyup.native="checkCapslock" @blur="capsTooltip = false" />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>
      <el-tooltip v-model="recapsTooltip" content="大写锁定已打开" placement="right" manual>
        <el-form-item prop="password2">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input :key="password2Type" ref="password2" v-model="registerForm.password2" :type="password2Type" placeholder="确认密码" tabindex="3" autocomplete="on" @keyup.native="recheckCapslock" @blur="recapsTooltip = false" />
          <span class="show-pwd" @click="showPwd2">
            <svg-icon :icon-class="password2Type === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>
      <el-button type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleRegister">注册</el-button>
      <el-button type="info" style="width:100%;margin-bottom:30px;margin-left:0" @click="$router.push('/login')">返回</el-button>
    </el-form>
  </div>
</template>

<script>
import { register } from '@/api/user'
export default {
  data() {
    return {
      loginForm: {

      },
      loading: false,
      registerForm: {
        username: undefined,
        password: undefined,
        password2: undefined
      },
      capsTooltip: false,
      passwordType: 'password',
      recapsTooltip: false,
      password2Type: 'password',
      verifycodeImg: ''
    }
  },
  methods: {

    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd2() {
      if (this.password2Type === 'password') {
        this.password2Type = ''
      } else {
        this.password2Type = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password2.focus()
      })
    },
    recheckCapslock(e) {
      const { key } = e
      this.recapsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    handleRegister() {
      this.loading = true
      register(this.registerForm).then(response => {
        if (response.code === 20000) {
          this.$message({
            message: '注册成功',
            type: 'success',
            duration: 2000
          })
          this.$router.push('/login')
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

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .bottom-container {
    position: relative;
    text-align: center;

    .bottom {
      font-size: 12px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      vertical-align: center;
      font-weight: bold;
      line-height: 300px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
.word-v-middle{

  margin-bottom: 0;

  font-size: 12px;

  min-height: 31px;

  display: flex;

  align-items: center;

  justify-content: center;

  height: 31px;

  margin-top: 5px;

  color: #87878a;

  white-space: normal;

}

</style>
