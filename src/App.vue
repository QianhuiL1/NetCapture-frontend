<template>
  <div id="app">
    <Header v-show="$route.path!='/'&& $route.path!='/register'"></Header>
    <router-view v-show="$route.path=='/'||$route.path=='/register'"/>
    <!-- <router-view/> -->
  </div>
</template>

<script>
// import Header from './components/Header.vue'
import Header from './components/Header.vue'
import Login from './views/Login/login.vue'

export default  {
  name:  'App',
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