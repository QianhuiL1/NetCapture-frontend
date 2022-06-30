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
				<el-menu-item index="/home">疫情速报</el-menu-item>
				<el-menu-item index="/home1">疫情趋势</el-menu-item>
			</el-menu-item-group>
		</el-submenu>
    <el-submenu index="2">
			<template slot="title">
				<i class="el-icon-s-marketing" style="font-size: 28px;"></i>
				<span>  重点人员追踪</span>
			</template>
			<el-menu-item-group>
				<el-menu-item index="/infect">感染人员列表</el-menu-item>
				<el-menu-item index="/track">行动轨迹追踪</el-menu-item>
				<el-menu-item index="/connect">密接人员列表</el-menu-item>
				<el-menu-item index="/ci">次密接人员列表</el-menu-item>
			</el-menu-item-group>
		</el-submenu>
		 <el-submenu index="3">
			<template slot="title">
				<i class="el-icon-eleme" style="font-size: 28px;"></i>
				<span>  疫情概况一览</span>
			</template>
			<el-menu-item-group>
				<el-menu-item index="/map">重点地区</el-menu-item>
			</el-menu-item-group>
		</el-submenu>
		<el-submenu index="4">
			<template slot="title">
				<i class="el-icon-star-off" style="font-size: 28px;"></i>
				<span>  部门管理</span>
			</template>
			<el-menu-item-group>
				<el-menu-item index="/dept">部门通讯录</el-menu-item>
			</el-menu-item-group>
		</el-submenu>
		<el-submenu index="5">
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

</style>
