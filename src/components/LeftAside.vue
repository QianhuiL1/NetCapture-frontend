<template>
	<el-menu :router="true" :default-active="$route.path" class="el-menu-vertical-demo" background-color="#FBFBFF"
	 text-color="#1E1E1E" active-text-color="#EFEFEF" :collapse="collapsed">
		<div class="logobox">
			<img class="logoimg" src="../assets/littlelogo.png" alt="">
			<div class="tim"><span>疫情流调系统</span></div>
		</div>
		<el-submenu index="1">
			<template slot="title">
				<i class="el-icon-s-home" style="font-size: 28px;"></i>
				<span>  国内疫情</span>
			</template>
			<el-menu-item-group>
				<el-menu-item index="/home1">疫情趋势</el-menu-item>
				<el-menu-item index="/map">疫情概况</el-menu-item>
			</el-menu-item-group>
		</el-submenu>
    <el-submenu index="2" v-if="role == 3">
			<template slot="title">
				<i class="el-icon-s-marketing" style="font-size: 28px;"></i>
				<span>  重点人员追踪</span>
			</template>
			<el-menu-item-group>
				<el-menu-item index="/topology">拓扑图</el-menu-item>
				<el-menu-item index="/track">行动轨迹追踪</el-menu-item>
			</el-menu-item-group>
		</el-submenu>
		<el-submenu index="3" v-if="role == 3">
			<template slot="title">
				<i class="el-icon-view" style="font-size: 28px;"></i>
				<span>  重点人员列表</span>
			</template>
			<el-menu-item-group>
				<el-menu-item index="/infect">感染人员列表</el-menu-item>
				<el-menu-item index="/connect">密接人员列表</el-menu-item>
				<el-menu-item index="/ci">次密接人员列表</el-menu-item>
			</el-menu-item-group>
		</el-submenu>
		<el-submenu index="4" v-if="role == 1||role == 3">
			<template slot="title">
				<i class="el-icon-star-off" style="font-size: 28px;"></i>
				<span>  区级管理</span>
			</template>
			<el-menu-item-group>
				<el-menu-item index="/dept">部门通讯录</el-menu-item>
			</el-menu-item-group>
		</el-submenu>
		<el-submenu index="5" v-if="role == 4">
			<template slot="title">
				<i class="el-icon-office-building" style="font-size: 28px;"></i>
				<span>  社区管理</span>
			</template>
			<el-menu-item-group>
				<el-menu-item index="/community">社区住户信息</el-menu-item>
				<el-menu-item index="/communityInfect">重点人员上报</el-menu-item>
				<el-menu-item index="/communityImport">旅居人员登记</el-menu-item>
			</el-menu-item-group>
		</el-submenu>
		<el-submenu index="6" v-if="role == 1">
			<template slot="title">
				<i class="el-icon-share" style="font-size: 28px;"></i>
				<span>  用户管理</span>
			</template>
			<el-menu-item-group>
				<el-menu-item index="/checkUser">审核注册用户</el-menu-item>
			</el-menu-item-group>
		</el-submenu>
	</el-menu>
</template>

<script>

  // 导出模块
  export default {
    name:'LeftAside',
    props:['collapsed'],
	created(){
		this.getRole()
	},
	data(){
      return {
		  role:"",
		  id:"",
		  n:0,
      }
    },
	inject: ['reload'],  // 注入重载的功能（注入依赖）
    //监视
    watch: {
       //检测路由参数发生改变时，刷新当前页面 调用
       '$route': function(){
            this.reload()
        }
    },
    methods:{
		getRole(){
			this.id=setInterval(()=>{
				this.n=this.n+1
				if(this.n == 50){
					clearInterval(this.id)
				}
				
			this.role=(this.$store.state.user.roles)
			},1000)
		},
    }
	}
</script>
<style>
	.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 220px;
		padding: 0px;
		border: none;
    text-align: left;
  }

  .el-menu-item-group__title {
    padding: 0px;
  }
	
	.el-menu ::v-deep(.el-sub-menu.is-active > .el-sub-menu__title) {
		color: #3949AB !important;
	}
 
	.el-menu {
		border: none;
    height:100%;
	}

	.logobox {
		height: 60px;
		display: flex;
		flex-direction: row;
	}
	.logoimg {
		margin-left: 3px;
		padding: 2px;
	}
	.tim{
		margin-top: 23px;
		font-size: 18px;
		font-weight: 550;
		color:#1E1E1E;
	}
	.el-menu-item.is-active {
   background-color: #DD5043 !important;
	 border-top-left-radius: 18px;
	 border-bottom-left-radius: 18px;
}
.el-icon-s-home{
        background: url('../assets/epidemic.png') center center no-repeat;
        background-size: 25px;
    }
    .el-icon-s-home:before {
        font-size: 16px;
        visibility: hidden;
    }
	.el-icon-s-marketing{
        background: url('../assets/trace.png') center center no-repeat;
        background-size: 25px;
	}
	.el-icon-s-marketing:before {
        font-size: 16px;
        visibility: hidden;
    }
.el-icon-eleme{
			background: url('../assets/general.png') center center no-repeat;
      background-size: 25px;
}
.el-icon-eleme::before{
			font-size: 16px;
			visibility: hidden;
}
.el-icon-star-off{
			background: url('../assets/department.png') center center no-repeat;
      background-size: 25px;
}
.el-icon-star-off:before{
			font-size: 16px;
			visibility: hidden;
}
.el-icon-office-building{
		background: url('../assets/community.png') center center no-repeat;
    background-size: 25px;
}
.el-icon-office-building:before{
			font-size: 16px;
			visibility: hidden;
}
.el-icon-share{
		background: url('../assets/check.png') center center no-repeat;
    background-size: 25px;
}
.el-icon-share:before{
			font-size: 16px;
			visibility: hidden;
}
.el-icon-view{
		background: url('../assets/form.png') center center no-repeat;
    background-size: 25px;
}
.el-icon-view:before{
			font-size: 16px;
			visibility: hidden;
}

</style>
