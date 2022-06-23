import Vue from 'vue'
import App from './App.vue'
import router from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    render: h => h(App),
}).$mount('#app')