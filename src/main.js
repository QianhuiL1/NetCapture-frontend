import Vue from 'vue'
import App from './App.vue'
import router from "./router/index";
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'
import "./assets/icons/iconfont.css";
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    render: h => h(App),
}).$mount('#app')