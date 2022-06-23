import Vue from 'vue'
import Router from 'vue-router'

import domesticOverview from '@/views/Overview/domestic/index'

Vue.use(Router)


export default new Router({
    routes: [{
        path: '/',
        redirect: domesticOverview,
        // component: domesticOverview,
        name: '国内疫情总览',
        // hidden: true
    }]
})