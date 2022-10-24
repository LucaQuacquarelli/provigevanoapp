import { createStore } from 'vuex';
import Axios from 'axios';
var config = require('../../config.json');

export default createStore({
    state: {
        config,
        all_players: [],
        all_players_availables: [],
        all_players_unavailables: [],
        players_by_level: [],
        levels: [],
        availables_players_counter: null,
        all_players_counter: null,
        all_goal_keepers_counter: null,
        all_goal_keepers_selected: [],
        allPossibilities: [],
        possibility: null,
        serverModal: false,
        errServer: null,
        successHeader: null,
        successModal: false,
        modalSlide: false,
        possibilityModal: false,
        asideStatus: false,
        inputSearch: ""
    },
    mutations: {
        setAside(state) {
            state.asideStatus = !state.asideStatus
        }
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
                    state.all_players_availables = res.data.all_players_availables
                    state.all_players_unavailables = res.data.all_players_unavailables
                })
                .catch((err) => {
                    state.serverModal = true;
                    state.errServer = err.message;
                });
        },
    }
});