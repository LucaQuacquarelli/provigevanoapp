import axios from 'axios';
import { createStore } from 'vuex';
var config = require('../../config.json');

export default createStore({
    state: {
        config,
        all_players: [],
        players_availables: []
    },
    getters: {
        getPlayers: (state) => state.all_players
    },
    actions: {
        fetchAllPlayers({ commit }) {
            try {
                axios.get(`${this.state.config.api_protocol}${this.state.config.api_url}:${this.state.config.api_port}/players`)
                    .then((resp) => {
                        commit('setAllPlayers', resp.data);
                    });
            } catch (error) {
                console.log(error);
            }
        }
    },
    mutations: {
        addAvailableplayer(state, player) {
            state.players_availables.push(player);
        },
        removeSelectedPlayer(state, player) {
            const index = state.players_availables.indexOf(player);
            if (index > -1) {
                state.players_availables.splice(index, 1);
            }
        },
        setAllPlayers(state, players) {
            state.all_players = players;
        }
    },

});