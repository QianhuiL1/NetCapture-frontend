<template>
<div class="top-nav">
  <el-menu :default-active="this.$route.path" :router ="true" class="el-menu-demo" mode="horizontal" background-color="#FBFBFF" text-color="##1E1E1E" active-text-color="#1E1E1E" >
    <el-button class="buttonimg">
      <img class="showimg" src="../assets/menu.png" @click="doToggle()">
    </el-button>
        <el-button class="buttonimg2">
      <img class="showimg" src="../assets/largeScreen.png" @click="full">
    </el-button>
      <div class="rdiv">
    </div>
    <el-submenu index="4" class="submenu">
      <template slot="title">
        <span style="font-size:20px;">{{ username }}</span>
        <span style="font-size: 10px" v-if="role==3">(湖北省)</span>
        </template>
      <router-link to="" @click.native="openOwn">
        <el-menu-item>个人中心</el-menu-item>
      </router-link>
      <el-menu-item @click="exit()" index="/home1">退出</el-menu-item>
    </el-submenu>
  </el-menu>
  <el-dialog
    title="个人中心"
    :visible.sync="userDialog"
    width="40%"
    style="z-index: 1"
    :modal-append-to-body="false"
    >
    <el-tabs v-model="activeName">
        <el-tab-pane label="个人信息" name="userInfo">
          <div class="list-group">
            <div class="list-group-item">
              <div class="little"><i class="el-icon-user-solid" />用户名称</div>
              <div class="pull-right">{{ user.name }}</div>
            </div>
            <div class="list-group-item">
              <div class="little">
              <div class="el-icon-phone" />手机号码</div>
              <div class="pull-right">{{ user.phone || '无' }}</div>
            </div>
            <div class="list-group-item">
              <div class="little">
              <svg-icon icon-class="email" />用户邮箱</div>
              <div class="pull-right">{{ user.email || '无' }}</div>
            </div>
            <div class="list-group-item">
              <div class="little">
              <svg-icon icon-class="tree" />身份</div>
              <div class="pull-right">
                {{ user.role }}
              </div>
            </div>
            <div class="list-group-item">
              <div class="little">
              <i class="el-icon-s-release" />创建日期</div>
              <div class="pull-right">{{ user.createTime }}</div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="修改资料" name="baseInfo">
          <el-form
            ref="baseForm"
            :model="baseInfo"
            :rules="baseRules"
            label-width="80px"
          >
            <el-form-item label="用户昵称" prop="nickName">
              <el-input v-model="baseInfo.nickName" maxlength="30" />
            </el-form-item>
            <el-form-item label="手机号码" prop="phonenumber">
              <el-input v-model="baseInfo.phonenumber" maxlength="11" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="baseInfo.email" maxlength="50" />
            </el-form-item>
            <el-form-item label="性别">
              <div class="radioGroup">
              <el-radio-group v-model="baseInfo.sex">
                <el-radio label="男">男</el-radio>
                <el-radio label="女">女</el-radio>
              </el-radio-group>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="button1" size="medium" @click="handleChange"
                >保存</el-button
              >
              <el-button type="primary" class="button2" size="medium" @click="userDialog=flase"
                >关闭</el-button
              >
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="修改密码" name="passwordInfo">
          <el-form ref="form" :model="form" :rules="rules" label-width="30%">
            <el-form-item label="旧密码" prop="oldPassword">
              <el-input
                v-model="form.oldPassword"
                style="width: 90%"
                placeholder="请输入旧密码"
                showPassword
              />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input
                v-model="form.newPassword"
                style="width: 90%"
                placeholder="请输入新密码"
                showPassword
              />
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="form.confirmPassword"
                style="width: 90%"
                placeholder="请输入确认密码"
                showPassword
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="button1" size="medium" @click="handleSubmit"
                >保存</el-button
              >
              <el-button
                type="primary"
                class="button2"
                size="medium"
                @click="userDialog= false"
                >关闭</el-button
              >
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer"> </span>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
 
<script>
import { getUserByName,updateUser,resetUserPwd,updateUserPwd,updateAuthRole, delUser } from "../api/system/user"
import screenfull from "screenfull"
export default {
  name: 'TopNav',
  created(){
		this.getName()
	},
  inject: ['reload'],  // 注入重载的功能（注入依赖）
    //监视
    watch: {
       //检测路由参数发生改变时，刷新当前页面 调用
       '$route': function(){
            this.reload()
        }
    },
  data() {
    const equalToPassword = (rule,value,callback) =>{
        if(this.form.newPassword != value){
          callback(new Error("两次输入的密码不一致"))
        }else {
          callback()
        }
      }
    return {
      role:"",
      id:"",
        n:0,
        username:"",
          collapsed:false,
          activeIndex: '1',
        activeIndex2: '1',
        titleList:[
          {name:'home1', navItem:'国内疫情'},
          {name:'track',navItem:'人员轨迹追踪'},
        ],
        img:require('../assets/list.png'),
        fullscreen: false,
        user:{
          name: '',
          phone: '',
          email: '',
          role:'',
          createTime: ''
        },
        baseInfo:{
          nickName: '',
          email: '',
          phonenumber: '',
          sex: '',
          userName:'',
          userId: ''
        },
        baseRules: {
        nickName: [
          { required: true, message: '用户昵称不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        phonenumber: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ]},
        rules: {
        oldPassword: [
          { required: true, message: '旧密码不能为空', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { min: 6, max: 20, message:'长度在6到20个字符',trigger: 'blur'}
        ],
        confirmPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { required: true, validator: equalToPassword, trigger:'blur'}
        ]
      },
      form: { oldPassword: '', newPassword: '', confirmPassword: '' },
      userDialog: false,
      activeName:"userInfo",
      userId:'',
      inputInfo: {
        userId: 0,
        roleIds: []
      },
      
    }

  },
  methods: {
    clear(){},
      openOwn(){
        this.userDialog=true
        this.user.name=this.username
        getUserByName(this.$store.state.user.name.split(',')[0]).then(res=>{
          this.user.email=res.rows[0].email
          this.user.phone=res.rows[0].phonenumber
          this.user.createTime=res.rows[0].createTime
          this.userId=res.rows[0].userId
          var role = this.$store.state.user.roles
          if(role=='1'){
            this.user.role='超级管理员'
          }else if(role=='2'){
            this.user.role='普通用户'
          }else if(role=='3'){
            this.user.role='疾控工作人员'
          }else{
            this.user.role='社区工作人员'
          }
        })
      },
      getName(){
      this.id=setInterval(()=>{
				this.n=this.n+1
				if(this.n == 50){
					clearInterval(this.id)
				}
        this.role=this.$store.state.user.roles
			this.username=this.$store.state.user.name.split(',')[1]
			},1000)
      },
      exit: function() {
        this.$confirm('确定要退出吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.$router.push('/');
        }).catch(() => {});
      },
      doToggle:function(){
          this.collapsed=!this.collapsed;
          this.$emit('open-collasped',this.collapsed);
      },
      full(){
        if(!screenfull.isEnabled){
          this.$message('您的浏览器不能全屏');
          return false
        }
        screenfull.toggle();
      },
      // 修改资料
      handleChange(){
        if(this.baseInfo.sex=='女'){
          this.baseInfo.sex='0'
        }else{
          this.baseInfo.sex='1'
        }
        this.baseInfo.userId=this.userId
        this.baseInfo.userName=this.$store.state.user.name.split(',')[0]
        this.baseInfo.roleIds=[]
        this.baseInfo.roleIds.push(this.$store.state.user.roles)
        updateUser(this.baseInfo).then(res=>{
          updateAuthRole(this.baseInfo.userId).then(re=>{
            this.$message.success('修改资料成功')
            this.userDialog=false
          })
        })
      },
      handleSubmit(){
        this.$refs["form"].validate(valid=>{
          if(valid) {
            updateUserPwd(this.form.oldPassword,this.form.newPassword).then(response=>{
                this.$message.success("修改成功")
                this.userDialog=false
            })
          }
        })
      },
  }
}
</script>
 
<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  display:flex;
    /* width: 200px; */
    min-height: 4em;
  }
 .el-menu-demo{
	position: relative;
	display: flex;
  z-index: 2000; 
 }
  .submenu {
    width:11em;
    height:4em;
    position:absolute;
	  right:0px;
    font-size: 16px;
    font-weight: 540;
  }
 .submenu-item{
    font-size: 16px;
    font-weight: 540;
    width:16em;
    display:flex;
 }
.rdiv{
  float:right;
}
 .item{
  margin: 0 auto
 }
 .submenu-item:focus {
   background-color: #DD5043 !important;
   	/* border-top-left-radius: 20px;
	 border-bottom-left-radius: 20px;
   border-top-right-radius: 20px;
   border-bottom-right-radius: 20px; */
}
  .buttonimg {
    height: 61px;
    width:60px;
    color: rgb(30, 46, 65);
    background-color: transparent;
    border: none;
  }
 .buttonimg:hover {
    background-color: #C9C9CC;
  }
  /* .buttonimg:focus {
    background-color:  #C9C9CC;
  } */
  .buttonimg2{
    height: 61px;
    width:60px;
    color: rgb(30, 46, 65);
    background-color: transparent;
    border: none;
    float: right;
  }
   .buttonimg2:hover {
    background-color: #C9C9CC;
  }
  .showimg {
    width: 25px;
    height: 24px;
    position: relative;
    margin-top:0px;
  }
 
  .showimg:active {
    border: none;
    background-color: transparent;
  }
.list-group{
  display: flex;
  flex-direction:column;
}
.list-group-item{
  margin-left: 10px;
  margin-top:10px;
  display: flex;
  flex-direction:row;
  justify-content: space-between;
  font-size: 20px;
}
.radioGroup{
  float: left;
  padding: 4px;
}
.buttonGroup{
  display: felx;
  flex-direction: row;
  /* justify-content: space-between; */
}
.button1{
  margin-right: 100px;
}
.button2{
  margin-right: 100px;
}

</style>