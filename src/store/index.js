import { createStore } from 'vuex';
var config = require('../../config.json');

export default createStore({
    state: {
        config,
        players_availables: []
    },
    mutations: {
        addAvailableplayer(state, player) {
            state.players_availables.push(player);
        },
        removeSelectedPlayer(state, player) {
            const index = state.players_availables.indexOf(player);
            if (index > -1) {
                // this.players_availables.splice(index, 1);
                state.players_availables.splice(index, 1);
            }
        }
    }
});