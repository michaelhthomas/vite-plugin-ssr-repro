import VueRouter from "vue-router"
import Index from '../views/index/index.vue';
import Test from '../views/test/index.vue';

const routes = [
  { path: '/', component: Index },
  { path: '/test', component: Test }
]

export const router = new VueRouter({
  mode: 'history',
  routes // short for `routes: routes`
})
