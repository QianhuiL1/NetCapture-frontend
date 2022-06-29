<template>
  <div
    class="login-container"
  >
    <el-card class="box-card">
      <el-form
        ref="registerForm"
        :model="registerForm"
        :rules="registerRules"
        class="register-form"
        label-position="left"
      >
        <div class="title-container">
          <div class="title">
            <img :src="logo" style="width:230px;height:110px;"/>
          </div>
        </div>
        <el-form-item prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="用户名"
            type="text"
            auto-complete="off"
          >
            <template slot="prepend"><svg-icon icon-class="user"/></template>
          </el-input>
        </el-form-item>
          <el-form-item prop="password" style="margin-top: 40px">
            <el-input
              v-model="registerForm.password"
              auto-complete="off"
              type="password"
              placeholder="登录密码"
              @keyup.enter.native="handleRegister"
            >
              <template slot="prepend"
                ><svg-icon icon-class="password"
              /></template>
            </el-input>
            </el-form-item>
            <el-form-item prop="confirmPassword" style="margin-top: 40px">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              auto-complete="off"
              placeholder="确认密码"
              @keyup.enter.native="handleRegister"
            >
              <template slot="prepend"
                ><svg-icon icon-class="password"
              /></template>
            </el-input>
          </el-form-item>
          <el-form-item prop="code" v-if="captchaOnOff">
        <el-input
          v-model="registerForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleLogin"
        >
        <template slot="prepend">
          <svg-icon icon-class="validCode"/>
        </template>
          <!-- <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon
          input-icon" /> -->
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img"/>
        </div>
      </el-form-item>
        <el-button
          class="submit-button"
          :loading="loading"
          type="primary"
          block
          @click.native.prevent="handleRegister"
        >
        <span v-if="!loading">注册</span>
        <span v-else>注册中...</span>
        </el-button>
        <div class="tip" @click="toLogin"><span>使用已有账户登录</span></div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { mapGetters } from 'vuex'
import { getCodeImg,register } from '@/api/login'

export default {
  name: 'Register',
  // components: { SocialSign },
  data() {
     const equalToPassword = (rule, value, callback) => {
      if (this.registerForm.password !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      logo: require('../../../public/logo.png'),
      codeUrl: "",
      registerForm: {
        username: "",
        password: "",
        confirmPassword: "",
        code: "",
        uuid: ""
      },
      registerRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" },
          { min: 2, max: 20, message: '用户账号长度必须介于 2 和 20 之间', trigger: 'blur' }
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" },
          { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, trigger: "blur", message: "请再次输入您的密码" },
          { required: true, validator: equalToPassword, trigger: "blur" }
        ],
        code: [{ required: true, trigger: "change", message: "请输入验证码" }]
      },
      loading: false,
      captchaOnOff: true
    }
  },
  created() {
    this.getCode();
  },
  mounted() {
        if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
    window.onresize = () => {
      this.getScale()
    }
    this.getScale()
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {

    getCode() {
      getCodeImg().then(res => {
        this.captchaOnOff = res.captchaOnOff === undefined ? true : res.captchaOnOff;
        if (this.captchaOnOff) {
          this.codeUrl = "data:image/gif;base64," + res.img;
          this.registerForm.uuid = res.uuid;
        }
      });
    },
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true;
          register(this.registerForm).then(res => {
            const username = this.registerForm.username;
            this.$alert("<font color='black'>恭喜你，您的账号 " + username + " 注册成功！</font>", '系统提示', {
              dangerouslyUseHTMLString: true,
              type: 'success'
            }).then(() => {
              this.$router.push('/');
            }).catch(() => {});
          }).catch(() => {
            this.loading = false;
            if (this.captchaOnOff) {
              this.getCode();
            }
          })
        }
      });
    },
    toLogin(){
      this.$router.push({path:'/'})
    },
    getScale() {
      this.scale = window.document.body.offsetWidth / window.screen.availWidth
      if (this.scale == 1) {
        this.scale = window.screen.availWidth / 1920
      }
    },
  }
}
</script>

<style lang="scss">

$bg: #e5e5e5;
$light_gray: #fff;
$cursor: #e5e5e5;

.login-code-img {
  height: 38px;
}
.login-code {
  width: 37%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.login-container {
  background: url(../../assets/loginbg2.png);
  background-size: 100% 100%;

  .el-form-item {
    // border: 1px solid rgba(255, 255, 255, 0.1);
    // background: rgba(0, 0, 0, 0.1);
    // border-radius: 5px;
    // color: #454545;
    border-bottom: 2px solid #ecebeb;
    .el-input__inner {
      transform: translateY(5px);
    }
  }
  .el-input-group__append,
  .el-input-group__prepend,
  .el-input__inner,
  .el-form-item.is-error .el-input__inner,
  .el-form-item.is-error .el-input__inner:focus,
  .el-form-item.is-error .el-textarea__inner,
  .el-form-item.is-error .el-textarea__inner:focus {
    border: none;
    background-color: rgba(0, 0, 0, 0);
    font-size: 24px;
    line-height: 50px;
    color: #666666;
  }
  .el-form-item__error {
    line-height: 35px;
  }
}

.login-container {
  min-height: 100%;
  width: 100%;
    // background-repeat: no-repeat;
  // background-color: $bg;
  overflow: hidden;
  position: relative;
  .box-card {
    // background-color: rgba(126, 144, 166);
    width: 500px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 200px;
  }
  .login-form {
    padding: 16px 16px 50px;
    margin: 0 auto;
    overflow: hidden;

    ::v-deep .submit-button {
      width: 100%;
      height: 40px;
      background-color: #cb1727;
      border-radius: 0px;
      overflow: hidden;
      font-size: 22px;
      color: #ffffff;
      margin-top: 24px;
    }
  }
.tip{
  margin-top: 24px;
  border-bottom: 1px solid #0F111A;
  width: 200px;
  margin: 24px auto;
}
.tip:hover{
  color: #858585;
  border-bottom: 1px solid #858585;
  cursor: pointer;
  transition: .2s;
}
  .tips {
    font-size: 20px;
    // color: #fff;
    margin-bottom: 10px;
    width: 20%;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    // color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    margin: 0 auto;
    .title {
      font-size: 20px;
      // color: $light_gray;
      color: #666666;
      text-align: center;
      font-weight: bold;
      // display:flex;
      margin: 0 auto;
      // margin-bottom: 10px;
      // width: 20px;
      // height: 20px;
      
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    // color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
.submit-button{
  font-size: 23px;
  padding: 10px;
  margin-top: 10px;
  width: 300px;
}
  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  // @media only screen and (max-width: 470px) {
  //   .thirdparty-button {
  //     display: none;
  //   }
  // }

  .image-code {
    position: absolute;
    top: 1px;
    right: 0;
    z-index: 5;
    border-radius: 0 5px 5px 0;
    width: 128px;
    height: 48px;
    cursor: pointer;
  }
}
</style>
