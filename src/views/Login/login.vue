<template>
  <div
    class="login-container" :style="backgorund"
  >
    <el-card class="box-card">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        autocomplete="on"
        label-position="left"
      >
        <div class="title-container">
          <div class="title">
            <img :src="logo"/>
          </div>
        </div>
        <el-form-item prop="username">
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="用户名"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="off"
          >
            <template slot="prepend"><svg-icon icon-class="user"/></template>
          </el-input>
        </el-form-item>
        <el-tooltip
          v-model="capsTooltip"
          content="Caps lock is On"
          placement="right"
          manual
        >
          <el-form-item prop="password" style="margin-top: 40px">
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="登录密码"
              name="password"
              tabindex="2"
              auto-complete="off"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
            >
              <template slot="prepend"
                ><svg-icon icon-class="password"
              /></template>
              <el-button slot="append" @click="showPwd"
                ><svg-icon
                  :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
              /></el-button>
            </el-input>
          </el-form-item>
        </el-tooltip>
        <el-form-item prop="code" v-if="captchaOnOff">
        <el-input
          v-model="loginForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleLogin"
        >
        <template slot="prepend">
          <svg-icon icon-class="validCode"/>
        </template>
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
          @click.native.prevent="handleLogin"
        >
          登 录
        </el-button>
        <div class="tip" @click="toRegister"><span>没有账号？现在去注册</span></div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { mapGetters } from 'vuex'
import {getUser,getUserByName,getAuthRole} from '../../api/system/user'
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'
export default {
  name: 'Login',
  // components: { SocialSign },
  data() {
    const validateUsername = (rule, value, callback) => {
      // if (!validUsername(value)) {
      //   callback(new Error('请输入用户名'))
      // } else {
      //   callback()
      // }
      if(value==''){
        callback(new Error('请输入用户名'))
      }else{
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!value || value.length < 4) {
        callback(new Error('密码不能小于4个字符'))
      } else {
        callback()
      }
    }
    return {
      logo: require('../../../public/logo.png'),
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        code: [{ required: true, trigger: "change", message: "请输入验证码" }]
      },
      codeUrl: "",
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      imageData: '',
      role:0,
      scale: 1,
      // 验证码开关
      captchaOnOff: true,
      // 注册开关
      register: true,

    }
  },
  computed: {
    // ...mapGetters(['rootRoles', 'permission_routes'])
  },
  watch: {
    // $route: {
    //   handler: function(route) {
    //     const query = route.query
    //     this.redirect = query.redirect
    //     this.otherQuery = this.getOtherQuery(query)
    //   },
    //   immediate: true
    // }
  },
  created() {
    this.getCode();
    this.getCookie();
    window.addEventListener('storage', this.afterQRScan)
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
    window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {getCode() {
      getCodeImg().then(res => {
        this.captchaOnOff = res.captchaOnOff === undefined ? true : res.captchaOnOff;
        if (this.captchaOnOff) {
          this.codeUrl = "data:image/gif;base64," + res.img;
          this.loginForm.uuid = res.uuid;
        }
      });
    },getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === false
      };
    },
    getScale() {
      this.scale = window.document.body.offsetWidth / window.screen.availWidth
      if (this.scale == 1) {
        this.scale = window.screen.availWidth / 1920
      }
    },
    checkCapslock(e) {
      // const { key } = e
      // this.capsTooltip = key && key.length === 1 && key >= 'A' && key <= 'Z'
    },
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
    handleLogin(){
            this.$refs.loginForm.validate(valid => {
        if (valid) {
          getUserByName(this.loginForm.username).then((res) => {
                getAuthRole(res.rows[0].userId).then((response) => {
                  this.loginForm.roleId=response.user.roles[0].roleId
                })})
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove('rememberMe');
          }
           getUserByName(this.loginForm.username).then((res) => {
                getAuthRole(res.rows[0].userId).then((response) => {
                  this.loginForm.roleId=response.user.roles[0].roleId
          this.$store.dispatch("Login", this.loginForm).then(() => {
             getUserByName(this.loginForm.username).then((res) => {
                getAuthRole(res.rows[0].userId).then((response) => {
            this.$router.push({ name:"map",
          params:{
            name:this.loginForm.username
          } }).catch(()=>{});
                })})
          }).catch(() => {
            this.loading = false;
            if (this.captchaOnOff) {
              this.getCode();
            }
          });
        })})
        }}
      //  this.$router.push({ path:'/home' })
    )},
    // handleLogin() {
    //   this.$refs.loginForm.validate(valid => {
    //     if (valid) {
    //       this.loading = true
    //       this.$store
    //         .dispatch('user/login', this.loginForm)
    //         .then(() => {
    //           if (this.rootRoles.includes('role_zhzx')) {
    //             this.$router.push({
    //               path: '/map/map'
    //             })
    //           } else if (this.rootRoles.includes('role_admin')) {
    //             this.handleRouter()
    //           } else if (
    //             this.rootRoles.length === 1 &&
    //             this.rootRoles[0] === 'USER'
    //           ) {
    //             this.$router.push({
    //               path: '/sso/no-role'
    //             })
    //           } else {
    //             this.$router.push({
    //               path: '/home'
    //             })
    //           }
    //           this.loading = false
    //         })
    //         .catch(e => {
    //           this.loading = false
    //           // console.log(e)
    //           if (e === '无角色') {
    //             // this.$router.push({ path: '/error' })
    //           } else {
    //             this.$message.error('请输入正确的用户名密码！')
    //           }
    //         })
    //     } else {
    //       return false
    //     }
    //   })
    // },
    handleRouter() {
      // const route = this.permission_routes.find(
      //   item => item.path === '/top-' + 'system'
      // )
      // this.$store.commit('permission/SET_CURRENT_ROUTES', route)
      // sessionStorage.setItem('activeMenu', 'system')
      // this.$router.push({ path: '/system-setup/group' })
    },
    toRegister(){
      this.$router.push({ path:'/register' })
    }
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
  background: url(../../assets/loginbg1.png);
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
</style>

<style lang="scss" scoped>
$bg: #e5e5e5;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-repeat: no-repeat;
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
    .title {
      height: 90px;
      line-height: 90px;
      display: flex;
      font-size: 40px;
      font-weight: bold;
      color: #454545;
      justify-content: center;
      margin: 0 0 50px;
    }
    img {
      margin-right: 12px;
    }
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

    .title {
      font-size: 26px;
      // color: $light_gray;
      color: #666666;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
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
  padding: 10px;
  margin-top: 10px;
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
