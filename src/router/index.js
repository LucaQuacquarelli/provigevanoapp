import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import ChoosePlayers from '../views/ChoosePlayers.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/players',
    name: 'PlayersView',
    props: true,
    component: () => import("../views/PlayersView.vue"),
  },
  {
    path: '/choose_players',
    name: 'ChoosePlayers',
    component: ChoosePlayers
  },
  {
    path: '/selected_players',
    name: 'SelectedPlayers',
    props: true,
    component: () => import("../views/SelectedPlayers.vue"),
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
