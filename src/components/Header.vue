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

  // 导出模块
  export default {
    name:'Main',
	created(){
		this.getRole()
	},
    data:function(){
      return {
		  role:"",
        collapsed:false,
      }
    },
    components:{
      LeftAside,
      TopNav
    },
    methods:{
		getRole(){
			this.role=(this.$store.state.user.roles)
		},
      doClick:function(collasped){
        this.collapsed=collasped;
      }
    }
  };
</script>
<style scoped>
	.main-container {
		height: 100%;
		width: 100%!important;
		/* box-sizing: border-box; */
	}

	.main-aside-collapsed {
		width: 60px !important;
		height: 100%;
		background-color: #FBFBFF;
		padding: 0px;
	}

	.main-aside {
		width: 220px!important;
		height: 100%;
		background-color: #FBFBFF;
		padding: 0px;
	}

	.main-header,
	.main-center {
		padding: 0px;
		/* border-left: 2px solid #333; */
	}
</style>
