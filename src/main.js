import Vue from 'vue'
import App from './App.vue'
import router from "./router/index";
import VueRouter from "vue-router";
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'
import "./assets/icons/iconfont.css";
import echarts from 'echarts'
import './assets/icons/index.js'
Vue.prototype.$echarts = echarts

Vue.use(VueRouter);
import VueAMap from 'vue-amap';
Vue.use(VueAMap);

VueAMap.initAMapApiLoader({
    // 高德key
    key: '9f693d11d5d5eef597c781eadfd7371e', // 自己到官网申请，我随便写的
    // 插件集合 （插件按需引入）
    plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.MarkerClusterer'],
    v: '1.4.15', // 我也不知道为什么要写这个，不写项目会报错，而且我随便写的，跟我下载的版本对应不了
    uiVersion: '1.0.11' // ui版本号，也是需要写，不配置不加载,

})
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    render: h => h(App),
})