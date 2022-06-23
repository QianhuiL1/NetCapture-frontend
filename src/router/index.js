import Vue from 'vue'
import VueRouter from 'vue-router';
import Config from './config';

Vue.use(VueRouter)
const router = new VueRouter(Config);

export default router;