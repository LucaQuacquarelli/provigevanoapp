import { createStore } from 'vuex';
import Axios from 'axios';
var config = require('../../config.json');

export default createStore({
    state: {
        config,
        all_players: [],
        levels: [],
        serverModal: false,
        errServer: null,
        successHeader: null,
        successModal: false,
        inputSearch: ""
    },
    getters: {
        apiPath(state) {
            return `${state.config.api_protocol}${state.config.api_url}:${state.config.api_port}`;
        }
    },
    actions: {
        searchPlayers({ state, getters }) {
            Axios
                .post(`${getters.apiPath}/players/search`,
                    {
                        inputSearch: state.inputSearch
                    }
                )
                .then((res) => {
                    state.all_players = res.data;
                })
                .catch((err) => {
                    state.serverModal = true;
                    state.errServer = err.message;
                });
        },
    }
});