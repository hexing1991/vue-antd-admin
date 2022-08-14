<template>
  <div id="userLayout" :class="['user-layout-wrapper']">
    <div class="container">
      <div class="user-layout-content">
        <div class="login-box">
          <div class="top">
            <div class="header">
              <span class="title">{{ title }}</span>
            </div>
          </div>
          <div class="main">
            <a-form class="user-layout-login" ref="formLogin" :form="form" @submit="handleSubmit">
              <a-tabs activeKey="tab1" :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }">
                <a-tab-pane key="tab1" tab="账号密码登录">
                  <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px;" :message="errorMsg||'账户或密码错误'" />
                  <a-form-item>
                    <a-input size="large" placeholder="登录账户" :maxLength="20" v-decorator="['userAccount',{rules: [{ required: true, min: 6, max: 20,message: '请输入正确的帐户' }]}]" autocomplete="off">
                      <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
                    </a-input>
                  </a-form-item>
                  <a-form-item>
                    <a-input-password size="large" placeholder="登录密码" :maxLength="20" v-decorator="['userPassword',{rules: [{ required: true, min: 6, max: 20,message: '请输入正确的密码' }]}]">
                      <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
                    </a-input-password>
                  </a-form-item>
                  <a-form-item>
                    <a-input size="large" placeholder="验证码" :maxLength="4" v-decorator="['yzm',{rules: [{ required: true, min: 4, max: 4,message: '请输入验证码' }]}]" autocomplete="off">
                      <a-icon slot="prefix" type="property-safety" :style="{ color: 'rgba(0,0,0,.25)' }" />
                      <img slot="addonAfter" :src="yzmImg" @click="onYzm" />
                    </a-input>
                  </a-form-item>
                </a-tab-pane>
              </a-tabs>
              <a-form-item>
                <a-button size="large" type="primary" htmlType="submit" class="login-button" :loading="loginBtn" :disabled="loginBtn">登录</a-button>
              </a-form-item>
            </a-form>
          </div>
          <div class="footer">
            <div class="copyright">技术支持 湖北省楚天云有限公司</div>
            <div class="copyright">版本号 V1.0.1</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getYzm } from '@/api/user'

export default {
  name: 'LoginForm',
  data () {
    const form = this.$form.createForm(this)
    return {
      title: process.env.VUE_APP_TITLE,
      loginBtn: false,
      isLoginError: false,
      errorMsg: '',
      timestamp: '',
      sign: '',
      yzmImg: '',
      form
    }
  },
  created () {
    this.onYzm()
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields(async (err, values) => {
        if (err) return
        this.loginBtn = true
        try {
          await this.$store.dispatch('Login', { ...values, timestamp: this.timestamp, sign: this.sign })
          this.$router.push('/sys/dept')
          this.isLoginError = false
        } catch (ex) {
          this.errorMsg = ex.message
          this.isLoginError = true
        } finally {
          this.loginBtn = false
          this.onYzm()
        }
      })
    },
    onYzm () {
      getYzm().then(r => {
        if (r.code !== 0) {
          this.errorMsg = r.msg
          this.isLoginError = true
          this.sign = null
          this.timestamp = null
          this.yzmImg = null
          return
        }
        const ss = r.data.yzmSign.split(',')
        this.sign = ss[0]
        this.timestamp = ss[1]
        this.yzmImg = 'data:image/jpg;base64,' + r.data.base64
      }).catch(e => {
        this.errorMsg = e.message
        this.isLoginError = true
      })
    }
  }
}

</script>

<style lang="less" scoped>
#userLayout.user-layout-wrapper {
  height: 100%;

  &.mobile {
    .container {
      .main {
        max-width: 368px;
        width: 98%;
      }
    }
  }

  .container {
    width: 100%;
    min-height: 100%;
    background: #f0f2f5 url(~@/assets/background.svg) no-repeat 50%;
    background-size: 100%;
    position: relative;

    .user-layout-content {
      padding: 100px 0 24px;
      position: relative;
      .login-box {
        width: 368px;
        position: absolute;
        left: 10%;
        top: 300px;
      }
      .top {
        text-align: center;

        .header {
          height: 44px;
          line-height: 44px;
          .title {
            font-size: 33px;
            color: rgba(0, 0, 0, 0.85);
            font-family: Avenir, "Helvetica Neue", Arial, Helvetica, sans-serif;
            font-weight: 600;
            position: relative;
            top: 2px;
          }
        }
      }

      .main {
        min-width: 260px;
        width: 368px;
        margin: 0 auto;
      }

      .footer {
        width: 100%;
        bottom: 0;
        padding: 0 16px;
        margin: 48px 0 24px;
        text-align: center;

        .copyright {
          color: rgba(0, 0, 0, 0.45);
          font-size: 14px;
        }
      }
    }
  }
}

.user-layout-login {
  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }
}
</style>
