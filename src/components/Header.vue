<template>
	<el-container class="main-container">
	<el-aside v-bind:class="collapsed?'main-aside-collapsed':'main-aside'">
			<LeftAside :collapsed="collapsed"></LeftAside>
		</el-aside>
		<el-container>
			<el-header class="main-header">
				<TopNav @open-collasped="doClick"></TopNav>
			</el-header>
			<el-main class="main-center">
        <router-view/>        
      </el-main>
		</el-container>
	</el-container>
</template>
 
<script>
  // 导入组件
  import TopNav from '@/components/TopNav.vue'
  import LeftAside from '@/components/LeftAside.vue'
 
    //组件传值
    //子组件：TopNav LefAside
    //父组件：Main
    //子到父 TopNav-》Main  this.$emit(自定义事件名,参数1......)
    //父到子 Main-》LefAside    props属性方式
 
  // 导出模块
  export default {
    name:'Main',
    data:function(){
      return {
        collapsed:false,
      }
    },
    components:{
      LeftAside,
      TopNav
    },
    methods:{
      doClick:function(collasped){
            this.collapsed=collasped;
            console.log('Main组件的collasped='+collasped);
      }
    }
  };
</script>
<style scoped>
	.main-container {
		height: 100%;
		width: 100% !important;
		box-sizing: border-box;
	}
 
	.main-aside-collapsed {
		width: 64px !important;
		height: 100%;
		background-color: #334157;
		margin: 0px;
	}
 
	.main-aside {
		width: 240px !important;
		height: 100%;
		background-color: #334157;
		margin: 0px;
	}
 
	.main-header,
	.main-center {
		padding: 0px;
		border-left: 2px solid #333;
	}
</style>
