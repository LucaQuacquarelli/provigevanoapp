import { createStore } from 'vuex';
var config = require('../../config.json');

export default createStore({
    state: {
        config,
        all_players: []
    }
});