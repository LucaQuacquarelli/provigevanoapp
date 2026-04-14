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
    roles: [],
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
    },
    setAllGoalKeepers(state, goalkeepers) {
      state.all_goal_keepers = goalkeepers
    },
    possibilityModalChange(state) {
      state.possibilityModal = !state.possibilityModal
    },
    setPossibilityModal(state, value) {
      state.possibilityModal = value
    },
    resetInputSearch(state) {
      state.inputSearch = ''
    },
    setAllPossibilities(state, payload) {
      if (Array.isArray(payload)) {
        state.allPossibilities = payload
      } else {
        state.allPossibilities.push(payload)
      }
    },
    setTeamsSettings(state, playersCount) {
      state.allPossibilities = []
      const minPlayers = 5
      const maxPlayers = 11
      for (let i = 2; i < 5; i++) {
        const playersForTeam = playersCount / i
        const teams = playersCount / playersForTeam
        if (Number.isInteger(teams) && Number.isInteger(playersForTeam) && playersForTeam >= minPlayers && playersForTeam <= maxPlayers) {
          state.allPossibilities.push({ teams, playersForTeam })
        }
      }
    },
    setPossibility(state, possibility) {
      state.possibility = possibility
    },
    checkOnPossibility(state, possibility) {
      state.possibility = possibility
    },
    setRoles(state, roles) {
      state.roles = roles
    }
  },
  getters: {
    apiPath(state) {
      return `${state.config.api_protocol}${state.config.api_url}:${state.config.api_port}`
    },
    randomSortedPlayers(state) {
      return state.all_players_availables.filter(player => {
        return player.role.name !== 'goalkeeper'
      }).sort(() => Math.random() - 0.5)
    },
    playerNotFound(state) {
      return state.all_players_availables == 0 && state.all_players_unavailables == 0
    },
    showConfirmButton({ all_players_availables, allPossibilities }) {
      return all_players_availables.length >= 10 && allPossibilities.length != 0
    }
  },
  actions: {
    setAvailability({ getters }, player) {
      return Axios.post(`${getters.apiPath}/players_availability`, {
        id: player.id,
        available: player.available
      })
    },
    setGoalKeepersProvisory({ getters }, player) {
      return Axios.post(`${getters.apiPath}/goalkeeper_provisory`, {
        id: player.id
      })
    },
    clearGoalKeepersProvisory({ getters }) {
      return Axios.get(`${getters.apiPath}/goalkeeper_provisory/clear`)
    },
    fetchRoles({ getters, commit }) {
      return Axios.get(`${getters.apiPath}/roles`)
        .then((res) => { commit('setRoles', res.data) })
    },
    searchPlayers({ state, getters, commit }, playersFiltered) {
      Axios
        .post(`${getters.apiPath}/players/search`,
          {
            inputSearch: state.inputSearch,
            playersFiltered
          }
        )
        .then((res) => {
          if (res.data.all_players_availables && res.data.all_players_unavailables) {
            commit('setAllPlayersAvailables', res.data.all_players_availables)
            commit('setAllPlayersUnavailables', res.data.all_players_unavailables)
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
