<template>
  <el-menu :default-active="this.$route.path" router class="el-menu-demo" mode="horizontal" background-color="#334157" text-color="#fff" active-text-color="#fff">
    <el-button class="buttonimg">
      <img class="showimg" :src="collapsed?imgshow:imgsq" @click="doToggle()">
    </el-button>
    	<el-menu-item v-for="(tit,i) in titleList" :key="i" :index="tit.name">
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
          {name:'aboard',navItem:'国外疫情'},
          {name:'track',navItem:'人员轨迹追踪'},
        ]
          // imgshow:require('../assets/img/show.png'),
          // imgsq:require('../assets/img/sq.png')
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
           console.log('TopNav组件的collasped='+this.collasped);
          this.$emit('open-collasped',this.collapsed);
      }
    }
  }
</script>
 
<style scoped>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    border: none;
  }
 .el-menu-demo{
	position: relative;
	display: flex;
 }
  .submenu {
    position:absolute;
	right:0px;
  }
 
  .buttonimg {
    height: 60px;
    background-color: transparent;
    border: none;
  }
 
  .showimg {
    width: 26px;
    height: 26px;
    position: absolute;
    top: 17px;
    left: 17px;
  }
 
  .showimg:active {
    border: none;
  }
</style>