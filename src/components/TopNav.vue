<template>
  <el-menu :default-active="this.$route.path" :router ="true" class="el-menu-demo" mode="horizontal" background-color="#FBFBFF" text-color="##1E1E1E" active-text-color="#1E1E1E" >
    <el-button class="buttonimg">
      <img class="showimg" src="../assets/menu.png" @click="doToggle()">
    </el-button>
    	<el-menu-item class="submenu-item" v-for="(tit,i) in titleList" :key="i" :index="tit.name">
        <template>
          <div class="item">
            <span>{{ tit.navItem }}</span>
          </div>
          </template>
      </el-menu-item>
      <div class="rdiv">
    <el-button class="buttonimg2">
      <img class="showimg" src="../assets/largeScreen.png" @click="full">
    </el-button>
    </div>
    <el-submenu index="4" class="submenu">
      <template slot="title">超级管理员</template>
      <el-menu-item index="4-1">设置</el-menu-item>
      <el-menu-item index="4-2">个人中心</el-menu-item>
      <el-menu-item @click="exit()" index="/home1">退出</el-menu-item>
    </el-submenu>
  </el-menu>
</template>
 
<script>
import screenfull from "screenfull"
  export default {
    name: 'TopNav',
    data: function() {
      return {
        collapsed:false,
        activeIndex: '1',
        activeIndex2: '1',
        titleList:[
          {name:'home1', navItem:'国内疫情'},
          {name:'track',navItem:'人员轨迹追踪'},
        ],
        img:require('../assets/list.png'),
        fullscreen: false
      }
    },
    methods: {
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
      }
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
  /* .buttonimg2:focus {
    background-color:  #C9C9CC;
  } */
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
</style>