import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import PlayersView from '../views/PlayersView.vue';

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
  /**
   *!NOT USED YET
   */
  {
    path: '/edit_player/',
    name: 'EditPlayer',
    props: true,
    component: () => import("../views/EditPlayer.vue"),
  },
  {
    path: '/selected_players/',
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
