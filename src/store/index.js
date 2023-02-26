import { createStore } from 'vuex';
import Axios from 'axios';
var config = require('../../config.json');

export default createStore({
    state: {
        config,
        all_players: [],
        all_players_availables: [],
        all_players_unavailables: [],
        all_goal_keepers: [],
        players_by_level: [],
        levels: [],
        allPossibilities: [],
        possibility: null,
        serverModal: false,
        errServer: null,
        successHeader: null,
        successModal: false,
        modalSlide: false,
        possibilityModal: false,
        inputSearch: "",
        lastResult : false,
    },
    mutations: {
        
    },
    getters: {
        apiPath(state) {
            return `${state.config.api_protocol}${state.config.api_url}:${state.config.api_port}`;
        }
    },
    actions: {
        searchPlayers({ state, getters }, playersFiltered) {
            Axios
                .post(`${getters.apiPath}/players/search`,
                    {
                        inputSearch: state.inputSearch,
                        playersFiltered
                    }
                )
                .then((res) => {
                    if (res.data.all_players_availables && res.data.all_players_unavailables) {
                        state.all_players_availables = res.data.all_players_availables
                        state.all_players_unavailables = res.data.all_players_unavailables
                    } else {
                        state.all_players = res.data
                    }

                })
                .catch((err) => {
                    state.serverModal = true;
                    state.errServer = err.message;
                });
        },
    }
});