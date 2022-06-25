<template>
  <el-menu :default-active="this.$route.path" :router ="true" class="el-menu-demo" mode="horizontal" background-color="#334157" text-color="#fff" active-text-color="#C8000A">
    <el-button class="buttonimg">
      <img class="showimg" :src="img" @click="doToggle()">
    </el-button>
    	<el-menu-item class="submenu-item" v-for="(tit,i) in titleList" :key="i" :index="tit.name">
        <template>{{ tit.navItem }}</template>
      </el-menu-item>
    <el-submenu index="4" class="submenu">
      <template slot="title">超级管理员</template>
      <el-menu-item index="4-1">设置</el-menu-item>
      <el-menu-item index="4-2">个人中心</el-menu-item>
      <el-menu-item @click="exit()" index="4-3">退出</el-menu-item>
    </el-submenu>
  </el-menu>
</template>
 
<script>
  export default {
    name: 'TopNav',
    data: function() {
      return {
          collapsed:false,
          activeIndex: '1',
        activeIndex2: '1',
        titleList:[
          {name:'home', navItem:'国内疫情'},
          {name:'track',navItem:'人员轨迹追踪'},
        ],
          img:require('../assets/list.png'),
      }
    },
    methods: {
      exit: function() {
        this.$confirm('确定要退出吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
             this.$router.push('/login');
        }).catch(() => {});
      },
      doToggle:function(){
          this.collapsed=!this.collapsed;
          this.$emit('open-collasped',this.collapsed);
      }
    }
  }
</script>
 
<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  display:flex;
    /* width: 200px; */
    min-height: 4em;
    border: none;
  }
 .el-menu-demo{
	position: relative;
	display: flex;
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
    height:4em;
 }
 .submenu-item:focus {
   background-color: rgb(30, 46, 65) !important;
}
  .buttonimg {
    height: 70px;
    width:60px;
    background-color: transparent;
    border: none;
  }
 .buttonimg:hover {
    background-color: transparent;
  }
  .buttonimg:focus {
    background-color: transparent;
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
</style>