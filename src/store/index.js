import { createStore } from 'vuex'
import Axios from 'axios'
const config = require('../../config.json')

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
    inputSearch: '',
    lastResult: false,
    finalTeams: []
  },
  mutations: {
    setAllPlayersUnavailables(state, allPlayersUnavailables) {
      state.all_players_unavailables = allPlayersUnavailables
    },
    setAllPlayersAvailables(state, allPlayersAvailables) {
      state.all_players_availables = allPlayersAvailables
    }
  },
  getters: {
    apiPath(state) {
      return `${state.config.api_protocol}${state.config.api_url}:${state.config.api_port}`
    },
    randomSortedPlayers(state) {
      return state.all_players_availables.filter(player => {
        return player.role.name === 'player'
      }).sort(() => Math.random() - 0.5)
    },
    playerNotFound(state) {
      return state.all_players_availables == 0 && state.all_players_unavailables == 0
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
          state.serverModal = true
          state.errServer = err.message
        })
    }
  }
})
