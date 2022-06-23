<template>
  <div id="app">
    <DemosticOverview/>
    <!-- <ForeignOverview/> -->
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import DemosticOverview from './views/Overview/domestic'
import ForeignOverview from './views/Overview/foreign'

export default {
    name: "App",
    components: { DemosticOverview, ForeignOverview }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
