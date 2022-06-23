<template>
	<el-menu :router="true" :default-active="$route.name" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" background-color="#334157"
	 text-color="#fff" active-text-color="#ffd04b" :collapse="collapsed" :collapse-transition="bb">
		<!-- <el-menu default-active="2" :collapse="collapsed" collapse-transition router :default-active="$route.path" unique-opened class="el-menu-vertical-demo" background-color="#334157" text-color="#fff" active-text-color="#ffd04b"> -->
		<div class="logobox">
			<img class="logoimg" src="../assets/logo1.png" alt="">
		</div>
		<el-submenu index="1">
			<template slot="title">
				<i class="el-icon-s-home" style="font-size: 28px;"></i>
				<span>  国内疫情</span>
			</template>
			<el-menu-item-group>
				<el-menu-item index="/home">疫情速报</el-menu-item>
				<el-menu-item index="/home1">疫情趋势</el-menu-item>
			</el-menu-item-group>
		</el-submenu>
		<el-submenu index="2">
			<template slot="title">
				<i class="el-icon-s-promotion" style="font-size: 28px;"></i>
				<span>  国外疫情</span>
			</template>
			<el-menu-item-group>
				<!-- <template slot="title">国内疫情</template> -->
				<el-menu-item index="/aboard">疫情速报</el-menu-item>
				<el-menu-item index="/aboard1">疫情趋势</el-menu-item>
			</el-menu-item-group>
		</el-submenu>
        <el-submenu index="3">
			<template slot="title">
				<i class="el-icon-s-marketing" style="font-size: 28px;"></i>
				<span>  重点人员追踪</span>
			</template>
			<el-menu-item-group>
				<!-- <template slot="title">国内疫情</template> -->
				<el-menu-item index="/infect">感染人员列表</el-menu-item>
				<el-menu-item index="/track">行动轨迹追踪</el-menu-item>
				<el-menu-item index="/connect">密接人员列表</el-menu-item>
			</el-menu-item-group>
		</el-submenu>
	</el-menu>
</template>
<script>
	export default {
    name:'LeftAside',
    props:['collapsed'],
	}
</script>
<style>
	.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
	padding: 0px;
	border: none;
    text-align: left;
  }
 
  .el-menu-item-group__title {
    padding: 0px;
  }
 
	.el-menu-bg {
		background-color: #1f2d3d !important;
	}
 
	.el-menu {
		border: none;
        height:100%;
	}

	.logobox {
		height: 80px;
		line-height: 40px;
		color: #9d9d9d;
		font-size: 20px;
		text-align: center;
		padding: 20px 0px;
	}
 
	.logoimg {
		height: 40px;
	}
</style>
