<template>
  <div id="app">
    <Header v-show="$route.path!='/'&& $route.path!='/register'"></Header>
    <router-view v-show="$route.path=='/'||$route.path=='/register'" v-if="isRouterAlive"/>
    <!-- <router-view/> -->
  </div>
</template>

<script>
// import Header from './components/Header.vue'
import Header from './components/Header.vue'
import Login from './views/Login/login.vue'

export default  {
  name:  'App',
  provide () {    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。                                             
            return {
                reload: this.reload                                              
            }
        },
        data() {
            return{
                isRouterAlive: true                    //控制视图是否显示的变量
            }
        },
        methods: {
            reload () {
                this.isRouterAlive = false;            //先关闭，
                this.$nextTick(function () {
                    this.isRouterAlive = true;         //再打开
                }) 
            }
        },
    metaInfo() {
        return {
            title: this.$store.state.settings.dynamicTitle && this.$store.state.settings.title,
            titleTemplate: title => {
                return title ? `${title} - ${process.env.VUE_APP_TITLE}` : process.env.VUE_APP_TITLE
            }
        }
    },
  components: {
    Header,
    Login
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>