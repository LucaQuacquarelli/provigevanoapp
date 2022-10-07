import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import PlayersView from '../views/PlayersView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/players',
    name: 'PlayersView',
    component: PlayersView
  },
  {
    path: '/edit_player/',
    name: 'EditPlayer',
    props: true,
    component: () => import("../views/EditPlayer.vue"),
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
