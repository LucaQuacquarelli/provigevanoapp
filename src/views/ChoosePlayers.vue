<template>
    <div class="d-flex flex-wrap">
        <div class="col-12">
            <h2 class="fw-bold">
                {{ $t('players.select_players') }}
            </h2>
        </div>
        <div class="col-12 my-4">
            <Search :playersFiltered="true" />
        </div>
    </div>
    <div class="form-floating d-none">
        <label for="players_list">Players list</label>
        <textarea name="players_list" id="players_list" v-model="players_list" class="form-control"></textarea>
    </div>

    <div class="accordion" id="accordionPlayers">
        <div class="accordion-item">
            <h2 class="accordion-header" id="AvailablesPlayers">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#availables"
                    aria-expanded="true" aria-controls="availables">
                    {{ $t('players.availables') }}
                    <span class="badge text-bg-success ms-2">
                        {{ all_players_availables.length }}
                    </span>
                </button>
            </h2>
            <div id="availables" class="accordion-collapse collapse" aria-labelledby="AvailablesPlayers"
                data-bs-parent="#accordionPlayers">
                <div class="accordion-body">
                    <div v-for="player in all_players_availables" :key="player.id">
                        <label v-if="player.available"
                            class="d-flex justify-content-between align-items-center p-4 mb-2 rounded-pill bg-success bg-gradient text-white"
                            :for="player.id">
                            <input class="d-none" type="checkbox" :id="player.id" v-model="player.available"
                                @change="setAvailability(player)" />
                            <span class="fs-5 fw-bold">
                                {{ player.nick_name }}
                            </span>
                            <span class="d-flex align-items-center">
                                <span class="badge fs-6 bg-dark me-2">
                                    {{ player.level.percentage }}
                                </span>
                                <span class="badge fs-6"
                                    :class="player.role.name == 'goalkeeper' ? 'bg-warning' : 'bg-info'">
                                    {{ roleAbbreviation(player.role.name) }}
                                </span>
                            </span>
                        </label>
                    </div>
                </div>
            </div>
        </div>

        <div class="accordion-item">
            <h2 class="accordion-header" id="UnavailablesPlayers">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#unavailables"
                    aria-expanded="true" aria-controls="unavailables">
                    {{ $t('players.not_availables') }}
                    <span class="badge text-bg-dark ms-2">
                        {{ all_players_unavailables.length }}
                    </span>
                </button>
            </h2>
            <div id="unavailables" class="accordion-collapse collapse" aria-labelledby="UnavailablesPlayers"
                data-bs-parent="#accordionPlayers">
                <div class="accordion-body">
                    <div v-for="player in all_players_unavailables" :key="player.id">
                        <label
                            class="d-flex justify-content-between align-items-center p-4 mb-2 rounded-pill bg-secondary bg-gradient text-white"
                            :for="player.id">
                            <input class="d-none" type="checkbox" :id="player.id" v-model="player.available"
                                @change="setAvailability(player)" />
                            <span class="fs-5 fw-bold">
                                {{ player.nick_name }}
                            </span>
                            <span class="d-flex align-items-center">
                                <span class="badge fs-6 bg-dark me-2">
                                    {{ player.level.percentage }}
                                </span>
                                <span class="badge fs-6"
                                    :class="player.role.name == 'goalkeeper' ? 'bg-warning' : 'bg-info'">
                                    {{ roleAbbreviation(player.role.name) }}
                                </span>
                            </span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="col-12 text-center my-3" v-if="playerNotFound">
        <h2>
            {{ $t('players.no_players') }}
        </h2>
    </div>

    <div class="col-12 py-2 text-center wrapper mt-4" v-if="showConfirmButton">
        <button class="btn btn-outline-success rounded-pill w-50" @click="possibilityModalChange">
            {{ $t('general.confirm') }}
        </button>
    </div>

    <transition name="fade-modal">
        <modal-slide v-if="possibilityModal">
            <template v-slot:header>
                <div
                    class="modal-header d-flex justify-content-between align-items-center py-2 px-4 border-bottom border-primary">
                    <span class="text-primary" @click="clearGoalKeepersProvisory">
                        {{ $t('general.cancel') }}
                    </span>
                    <h6 class="modal-title">
                        {{ $t('modal.teamsSettings.sort') }}
                    </h6>
                    <button :disabled="modalContent != null" @click="router.replace('/selected_players')"
                        class="border-0 bg-transparent"
                        :class="modalContent != null ? 'text-secondary' : 'text-primary'">
                        {{ $t('general.end') }}
                    </button>
                </div>
            </template>
            <template v-slot:body>
                <div class="modal-body p-4">
                    <div v-if="modalContent == false" class="d-flex justify-content-between align-items-center">
                        <div v-for="(possibility, index) in store.state.allPossibilities" :key="index"
                            :class="store.state.allPossibilities.length > 1 ? 'col-5' : 'col-12'">
                            <button class="btn btn-success rounded-pill w-100" @click="checkOnPossibility(possibility)">
                                {{ possibility.teams }} {{ $t('teams.teams') }} <br>
                                {{ $t('teams.from') }} {{ possibility.playersForTeam }} {{ $t('teams.players') }}
                            </button>
                        </div>
                    </div>
                    <div v-else-if="modalContent == true" class="d-flex flex-wrap align-items-center">
                        <div class="col-12 text-center">
                            <h4>
                                {{ chooseContentModalPossibility(choicePossibility) }} {{ differenceGk }}
                                {{ differenceGk == 1 ? $t('modal.teamsSettings.gk') :
                                    $t('modal.teamsSettings.gks') }}
                                {{ $t('modal.teamsSettings.toContinue') }}
                            </h4>
                        </div>
                        <div class="col-12 my-4">
                            <Search :playersFiltered="true" />
                        </div>
                        <div class="col-12" v-if="store.state.all_players_availables.length != 0">
                            <div class="availables-container">
                                <div v-if="choicePossibility == 'add'">
                                    <div v-for="player in store.state.all_players_availables" :key="player.id">
                                        <label v-if="player.role.id == 1"
                                            class="d-flex justify-content-between align-items-center p-4 mb-2 rounded-pill available">
                                            <input class="d-none" type="checkbox" v-model="player.available"
                                                @change="setGoalKeepersProvisory(player)" />
                                            <span class="fs-3 fw-bold">
                                                {{ player.nick_name }}
                                            </span>
                                            <span class="d-flex align-items-center">
                                                <span class="badge fs-6 bg-dark me-2">
                                                    {{ player.level.percentage }}
                                                </span>
                                                <span class="badge fs-6"
                                                    :class="player.role.name == 'goalkeeper' ? 'bg-warning' : 'bg-info'">
                                                    {{ roleAbbreviation(player.role.name) }}
                                                </span>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <div v-else>
                                    <div v-for="player in store.state.all_players_availables" :key="player.id">
                                        <label v-if="player.role.id == 2"
                                            class="d-flex justify-content-between align-items-center p-4 mb-2 rounded-pill available">
                                            <input class="d-none" type="checkbox" v-model="player.available"
                                                @change="setGoalKeepersProvisory(player)" />
                                            <span class="fs-3 fw-bold">
                                                {{ player.nick_name }}
                                            </span>
                                            <span class="d-flex align-items-center">
                                                <span class="badge fs-6 bg-dark me-2">
                                                    {{ player.level.percentage }}
                                                </span>
                                                <span class="badge fs-6"
                                                    :class="player.role.name == 'goalkeeper' ? 'bg-warning' : 'bg-info'">
                                                    {{ roleAbbreviation(player.role.name) }}
                                                </span>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 text-center mb-2"
                            v-if="store.state.all_players_availables.length == 0">
                            <h2>
                                {{ $t('players.no_players') }}
                            </h2>
                        </div>
                    </div>
                    <div v-else class="d-flex flex-wrap align-items-center">
                        <div class="col-12 text-center">
                            <h1 class="text-success">
                                <i class="fa-solid fa-circle-check"></i>
                            </h1>
                        </div>
                        <div class="col-12 text-center my-3">
                            <h2 v-for="goalkeeper in goalkeepersProvisoryFilter" :key="goalkeeper.id">
                                {{ goalkeeper.nick_name }}
                            </h2>
                            <span>
                                {{ goalkeepersProvisoryFilter.length > 1 ? $t('modal.teamsSettings.gks_provisory') :
                                    $t('modal.teamsSettings.gk_provisory') }}
                            </span>
                        </div>
                        <div class="col-12 text-center">
                            <small class="text-muted">
                                {{ $t('modal.teamsSettings.set') }}
                            </small>
                            <h6 class="text-muted">
                                {{ $t('modal.teamsSettings.or') }}
                            </h6>
                            <small class="text-muted">
                                {{ $t('modal.teamsSettings.discard') }}
                            </small>
                        </div>
                    </div>
                </div>
            </template>
        </modal-slide>
    </transition>
</template>

<script setup>
import Axios from 'axios'
import { computed, onMounted, ref } from "vue"
import { useStore } from "vuex"
import i18n from '../i18n'
import { useRouter } from "vue-router"

// import ModalSlide from '../components/ModalSlide.vue'
import Search from '../components/Search.vue'

const store = useStore()
const router = useRouter()

const modalContent = ref(false)
const choicePossibility = ref(null)
const differenceGk = ref(null)
const allPossibilities = ref(store.state.allPossibilities)
const all_players_availables = ref(store.state.all_players_availables)
const all_players_unavailables = ref(store.state.all_players_unavailables)

const roleAbbreviation = computed(() => {
    const abbreviation = {
        'goalkeeper': "PT",
        'player': "PL",
    }
    return role => abbreviation[role]
})

// const choicePossibility = ref(null)
// const differenceGk = ref(null)
// // const key = ref(false)
const translate = i18n.global.t.bind(i18n.global)

/**
 * Getters
 */
const apiPath = computed(() => store.getters.apiPath)
const playerNotFound = computed(() => store.getters.playerNotFound)
const showConfirmButton = computed(() => store.getters.showConfirmButton)
const possibilityModal = computed(() => store.state.possibilityModal)
const goalkeepersProvisoryFilter = computed(() =>
  store.state.all_goal_keepers.filter(gk => gk.goalkeeper_provisory)
)


/**
 * Methods
 */
const chooseContentModalPossibility = () => {
    const possibilitiesChecked = {
        'add': translate('modal.teamsSettings.addGk'),
        'remove': translate('modal.teamsSettings.removeGk')
    }
    return possibility => possibilitiesChecked[possibility]
}
// const goalkeepersProvisoryFilter = () => {
//     const goalkeepers_provisory = store.state.all_goal_keepers.filter(goalkeeper => { return goalkeeper.goalkeeper_provisory })
//     return goalkeepers_provisory
// }

// In script setup, we don't use mapMutations. 
// Instead, we use store.commit('mutationName', payload) directly.
// const setAllPlayersUnavailables = (payload) => store.commit('setAllPlayersUnavailables', payload)
// const allPlayersAvailables = (payload) => store.commit('setAllPlayersAvailables', payload)
const possibilityModalChange = () => store.commit('possibilityModalChange')
// const resetInputSearch = () => store.commit('resetInputSearch')
function setAvailability(player) {
    store.dispatch('setAvailability', player)
        .then(({ data }) => {
            store.commit('setAllPlayersAvailables', data.all_players_availables)
            store.commit('setAllPlayersUnavailables', data.all_players_unavailables)
            store.commit('setTeamsSettings', data.all_players_availables.length)
            store.commit('resetInputSearch')
        })
        .catch((err) => {
            // TODO modal errors 
            console.log(err)
        })
}
// function clearAvailability() {
//     store.dispatch('clearAvailability')
//         .then((res) => {
//             store.commit('setAllPlayersAvailables', res.data.all_players_availables)
//             store.commit('setAllPlayersUnavailables', res.data.all_players_unavailables)
//         })
//         .catch((err) => {
//             console.log(err)
//         })
// }
function setGoalKeepersProvisory(player) {
    store.dispatch('setGoalKeepersProvisory', player)
        .then((res) => {
            store.commit('setAllPlayersAvailables', res.data.all_players_availables_without_gk)
            store.commit('setAllGoalKeepers', res.data.all_gk_and_provisory)
            store.commit('checkOnPossibility', store.state.possibility)
        })
        .catch((err) => {
            console.log(err)
        })
}
function clearGoalKeepersProvisory() {
    store.dispatch('clearGoalKeepersProvisory')
        .then(({ data }) => {
            store.commit('setAllGoalKeepers', [])
            store.commit('setAllPlayersAvailables', data.all_players_availables)
            store.commit('setPossibilityModal', false)
            modalContent.value = false
        })
        .catch((err) => {
            console.log(err)
        })
}
function between(x, min, max) {
    return x >= min && x <= max
}
function setTeamsSettings(players) {
    store.commit('setAllPossibilities', [])
    const minPlayers = 5
    const maxPlayers = 9
    for (let i = 2; i < 5; i++) {
        var playersForTeam = players / i
        var teams = players / playersForTeam
        if (Number.isInteger(teams) && Number.isInteger(playersForTeam) && between(playersForTeam, minPlayers, maxPlayers)) {
            const possibilitiesObj = {
                teams,
                playersForTeam
            }
            store.commit('setAllPossibilities', possibilitiesObj)
        }
    }
}
// function checkOnPossibility(possibility) {
//     store.state.all_players_availables.forEach(
//         player => {
//             if (player.role.id === 2) {
//                 store.state.all_goal_keepers.push(player)
//             }
//         }
//     )
//     store.commit('setPossibility', possibility)
//     if (possibility.teams > store.state.all_goal_keepers.length) {
//         modalContent.value = true
//         choicePossibility.value = 'add'
//         differenceGk.value = possibility.teams - store.state.all_goal_keepers.length
//     } else if (possibility.teams < store.state.all_goal_keepers.length) {
//         modalContent.value = true
//         choicePossibility.value = 'remove'
//         differenceGk.value = store.state.all_goal_keepers.length - possibility.teams
//     } else {
//         modalContent.value = null
//     }
// }

onMounted(() => {
    Axios
        .get(`${apiPath.value}/players/available_unavailable`)
        .then(({ data }) => {
            all_players_availables.value = data.all_players_availables
            all_players_unavailables.value = data.all_players_unavailables
            store.commit('setAllPlayersAvailables', data.all_players_availables)
            store.commit('setAllPlayersUnavailables', data.all_players_unavailables)
            if (allPossibilities.value.length == 0) {
                setTeamsSettings(data.all_players_availables.length)
            }
            clearGoalKeepersProvisory()
        })
        .catch((err) => { console.log(err) })
})
</script>

<style lang="scss" scoped>
.btn-set-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    height: 60px;
    backdrop-filter: blur(10px);
    margin: 0 !important;
    z-index: 999;

    button {
        transition: 0.3s;
        width: 75% !important;
        background-color: green;
        box-shadow: 0 0 15px 10px green;
        font-weight: bold;
        color: white;
    }
}

.players-availables-wrapper,
.players-unavailables-wrapper {
    height: 100px;
    border: 1px solid green;
    // border-bottom: 0;
    overflow-y: auto;
    transition: 0.3s;

    &.open {
        height: 300px;
    }
}

.unavailables-container,
.availables-container {
    min-height: 50px;
    max-height: 480px;
    overflow-y: auto;
}

.unavailable {
    box-shadow: inset 0 -10px 15px 5px rgba(0, 0, 0, 1);
    filter: grayscale(100%);
    background-image: url('../assets/img/soccer-bg.jpg');
    background-size: cover;
    background-position-y: center;
    border-radius: 50em;
    border: 3px solid transparent;

    span.fs-3 {
        text-shadow: -2px 0 white, 0 2px white, 2px 0 white, 0 -2px white;
    }
}

.available {
    box-shadow: inset 0 0 15px 5px rgba(0, 0, 0, 0.8);
    background-image: url('../assets/img/soccer-bg.jpg');
    background-size: cover;
    background-position-y: center;
    border-radius: 50em;
    border: 3px solid transparent;

    span.fs-3 {
        text-shadow: -2px 0 white, 0 2px white, 2px 0 white, 0 -2px white;
    }
}

.modal-body {
    height: 600px;

    .fa-circle-check {
        font-size: 54px;
    }
}
</style>