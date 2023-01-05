import VueRouter from "vue-router"

const routes = [
  { path: '/', component: () => import('src/views/index/index.vue') },
  { path: '/test', component: () => import('src/views/test/index.vue') },
  { path: '/spa', component: () => import('src/views/spa/index.vue') }
]

export const createRouter = () => new VueRouter({
  mode: 'history',
  routes // short for `routes: routes`
})
