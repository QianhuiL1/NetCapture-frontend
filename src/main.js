import Vue from 'vue'
import Cookies from 'js-cookie'
import store from './store'
import plugins from './plugins'
import directive from './directive'
import { getConfigKey } from "@/api/system/config";
import { getDicts } from "@/api/system/dict/data";
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, handleTree } from "@/utils/ruoyi";
import { download } from '@/utils/request'
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
import screenfull from 'screenfull'

Vue.use(VueRouter);
import VueAMap from 'vue-amap';
Vue.use(VueAMap);
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree
Vue.use(plugins)
Vue.use(directive)
VueAMap.initAMapApiLoader({
    // 高德key
    key: '9f693d11d5d5eef597c781eadfd7371e',
    // 插件集合 （插件按需引入）
    plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapboxVectorTileLayer', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.MarkerClusterer'],
    v: '1.4.15',
    uiVersion: '1.0.11'

})
Vue.use(ElementUI)
Vue.config.productionTip = false


new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
})