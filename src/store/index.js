import { createStore } from 'vuex';
var config = require('../../config.json');

export default createStore({
    state: {
        config,
        all_players: [],
        levels: [],
        serverModal: false,
        errServer: null,
    },
    getters: {
        apiPath(state) {
            return `${state.config.api_protocol}${state.config.api_url}:${state.config.api_port}`
        }
    }
});