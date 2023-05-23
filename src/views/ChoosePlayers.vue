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
        <!-- <div class="col-12 d-flex flex-wrap align-items-start">
            <div class="col-12 players-availables-wrapper" v-if="this.$store.state.all_players_availables.length > 0">
                <div class="d-flex justify-content-between align-items-center p-4" @click="dropdown('availables')">
                    <h6 class="d-flex align-items-center fw-bold">
                        {{ $t('players.availables') }}
                        <span class="badge bg-dark ms-2">
                            {{ this.$store.state.all_players_availables.length }}
                        </span>
                    </h6>
                    <button class="ms-2 btn btn-outline-danger rounded-pill" @click="clearAvailability">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
                <div class="availables-container px-2">
                    <div v-for="player in this.$store.state.all_players_availables" :key="player.id">
                        <label v-if="player.available"
                            class="d-flex justify-content-between align-items-center p-4 mb-2 rounded-pill available"
                            :for="player.id">
                            <input class="d-none" type="checkbox" :id="player.id" v-model="player.available"
                                @change="setAvailability(player)" />
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
            <div class="col-12 players-unavailables-wrapper" v-if="this.$store.state.all_players_unavailables.length > 0">
                <div class="d-flex justify-content-between align-items-center p-4" @click="dropdown('unavailables')">
                    <h6 class="d-flex align-items-center fw-bold">
                        {{ $t('players.all_players') }}
                        <span class="badge bg-dark ms-2">
                            {{ this.$store.state.all_players_unavailables.length }}
                        </span>
                    </h6>
                </div>
                <div class="unavailables-container px-2">
                    <div v-for="player in this.$store.state.all_players_unavailables" :key="player.id">
                        <label class="d-flex justify-content-between align-items-center p-4 mb-2 rounded-pill unavailable"
                            :for="player.id">
                            <input class="d-none" type="checkbox" :id="player.id" v-model="player.available"
                                @change="setAvailability(player)" />
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
            <div class="col-12 text-center"
                v-if="this.$store.state.all_players_availables.length == 0 && this.$store.state.all_players_unavailables.length == 0">
                <h2>
                    {{ $t('players.no_players') }}
                </h2>
            </div>
        </div>
        <div class="col-12 py-2 text-center wrapper mt-4"
            v-if="this.$store.state.all_players_availables.length >= 10 && this.$store.state.allPossibilities.length != 0">
            <button class="btn btn-outline-success rounded-pill w-50" @click="this.$store.state.possibilityModal = true">
                {{ $t('general.confirm') }}
            </button>
        </div> -->
    </div>

    <div class="accordion" id="accordionPlayers">
        <div class="accordion-item">
            <h2 class="accordion-header" id="AvailablesPlayers">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#availables"
                    aria-expanded="true" aria-controls="availables">
                    {{ $t('players.availables') }}
                    <span class="badge text-bg-success ms-2">
                        {{ this.all_players_availables.length }}
                    </span>
                </button>
            </h2>
            <div id="availables" class="accordion-collapse collapse show" aria-labelledby="AvailablesPlayers"
                data-bs-parent="#accordionPlayers">
                <div class="accordion-body">
                    <div v-for="player in this.all_players_availables" :key="player.id">
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
                        {{ this.all_players_unavailables.length }}
                    </span>
                </button>
            </h2>
            <div id="unavailables" class="accordion-collapse collapse show" aria-labelledby="UnavailablesPlayers"
                data-bs-parent="#accordionPlayers">
                <div class="accordion-body">
                    <div v-for="player in this.all_players_unavailables" :key="player.id">
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

    <div class="col-12 text-center my-3" v-if="this.playerNotFound">
        <h2>
            {{ $t('players.no_players') }}
        </h2>
    </div>

    <div class="col-12 py-2 text-center wrapper mt-4" v-if="this.showConfirmButton">
        <button class="btn btn-outline-success rounded-pill w-50" @click="this.possibilityModalChange">
            {{ $t('general.confirm') }}
        </button>
    </div>

    <transition name="fade-modal">
        <modal-slide v-if="this.$store.state.possibilityModal">
            <template v-slot:header>
                <div
                    class="modal-header d-flex justify-content-between align-items-center py-2 px-4 border-bottom border-primary">
                    <span class="text-primary" @click="clearGoalKeepersProvisory">
                        {{ $t('general.cancel') }}
                    </span>
                    <h6 class="modal-title">
                        {{ $t('modal.teamsSettings.sort') }}
                    </h6>
                    <button :disabled="modalContent != null" @click="this.$router.replace('/selected_players')"
                        class="border-0 bg-transparent" :class="modalContent != null ? 'text-secondary' : 'text-primary'">
                        {{ $t('general.end') }}
                    </button>
                </div>
            </template>
            <template v-slot:body>
                <div class="modal-body p-4">
                    <div v-if="modalContent == false" class="d-flex justify-content-between align-items-center">
                        <div v-for="(possibility, index) in this.$store.state.allPossibilities" :key="index"
                            :class="this.$store.state.allPossibilities.length > 1 ? 'col-5' : 'col-12'">
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
                                {{ differenceGk == 1 ? this.$t('modal.teamsSettings.gk') : this.$t('modal.teamsSettings.gks') }}
                                {{ $t('modal.teamsSettings.toContinue') }}
                            </h4>
                        </div>
                        <div class="col-12 my-4">
                            <Search :playersFiltered="true" />
                        </div>
                        <div class="col-12" v-if="this.$store.state.all_players_availables.length != 0">
                            <div class="availables-container">
                                <div v-if="choicePossibility == 'add'">
                                    <div v-for="player in this.$store.state.all_players_availables" :key="player.id">
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
                                    <div v-for="player in this.$store.state.all_players_availables" :key="player.id">
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
                        <div class="col-12 text-center mb-2" v-if="this.$store.state.all_players_availables.length == 0">
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
                                {{ goalkeepersProvisoryFilter.length > 1 ? $t('modal.teamsSettings.gks_provisory') : $t('modal.teamsSettings.gk_provisory') }}
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

<script>
// import $ from 'jquery'
import { mapGetters, mapMutations, mapState } from "vuex"
import ModalSlide from '../components/ModalSlide.vue'
import Search from '../components/Search.vue'
// import store from "../store"
export default {
    name: "ChoosePlayers",
    components: { ModalSlide, Search },
    data() {
        return {
            modalContent: false,
            choicePossibility: null,
            differenceGk: null,
            key: false,
        }
    },
    computed: {
        ...mapGetters(['apiPath', 'playerNotFound', 'showConfirmButton']),
        ...mapState(['all_players_availables', 'all_players_unavailables', 'all_goal_keepers', 'possibility', 'lastResult', 'finalTeams', 'allPossibilities']),
        roleAbbreviation() {
            const abbreviation = {
                'goalkeeper': "PT",
                'player': "PL",
            }
            return role => abbreviation[role]
        },
        chooseContentModalPossibility() {
            const possibilitiesChecked = {
                'add': this.$t('modal.teamsSettings.addGk'),
                'remove': this.$t('modal.teamsSettings.removeGk')
            }
            return possibility => possibilitiesChecked[possibility]
        },
        goalkeepersProvisoryFilter() {
            const goalkeepers_provisory = this.all_goal_keepers.filter(goalkeeper => { return goalkeeper.goalkeeper_provisory })
            return goalkeepers_provisory
        }
    },
    methods: {
        ...mapMutations(['setAllPlayersUnavailables', 'setAllPlayersAvailables', 'possibilityModalChange', 'resetInputSearch']),
        setAvailability(player) {
            this.$http.post(`${this.apiPath}/players_availability`,
                {
                    id: player.id,
                    available: player.available
                })
                .then((res) => {
                    this.setAllPlayersAvailables(res.data.all_players_availables)
                    this.setAllPlayersUnavailables(res.data.all_players_unavailables)
                    this.setTeamsSettings(res.data.all_players_availables.length)
                    this.resetInputSearch()
                })
                .catch((err) => {
                    // TODO modal errors 
                    console.log(err)
                })
        },
        clearAvailability() {
            this.$http
                .get(`${this.$store.getters.apiPath}/players_availability/clear`)
                .then((res) => {
                    this.$store.state.all_players_unavailables = res.data
                    this.$store.state.all_players_availables = []
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        setGoalKeepersProvisory(player) {
            this.$http
                .post(`${this.$store.getters.apiPath}/goalkeeper_provisory`,
                    {
                        id: player.id
                    }
                )
                .then((res) => {
                    this.$store.state.all_goal_keepers = res.data.all_gk_and_provisory
                    this.$store.state.all_players_availables = res.data.all_players_availables_without_gk
                    this.checkOnPossibility(this.$store.state.possibility)
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        clearGoalKeepersProvisory() {
            this.$http
                .get(`${this.$store.getters.apiPath}/goalkeeper_provisory/clear`)
                .then((res) => {
                    this.$store.state.all_goal_keepers = []
                    this.$store.state.all_players_availables = res.data.all_players_availables
                    this.$store.state.possibilityModal = false
                    this.modalContent = false
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        between(x, min, max) {
            return x >= min && x <= max
        },
        setTeamsSettings(players) {
            this.$store.state.allPossibilities = []
            const minPlayers = 5
            const maxPlayers = 9
            for (let i = 2; i < 5; i++) {
                var playersForTeam = players / i
                var teams = players / playersForTeam
                if (Number.isInteger(teams) && Number.isInteger(playersForTeam) && this.between(playersForTeam, minPlayers, maxPlayers)) {
                    const possibilitiesObj = {
                        teams,
                        playersForTeam
                    }
                    this.$store.state.allPossibilities.push(possibilitiesObj)
                }
            }
        },
        checkOnPossibility(possibility) {
            this.$store.state.all_players_availables.forEach(
                player => {
                    if (player.role.id === 2) {
                        this.$store.state.all_goal_keepers.push(player)
                    }
                }
            )
            this.$store.state.possibility = possibility
            if (possibility.teams > this.$store.state.all_goal_keepers.length) {
                this.modalContent = true
                this.choicePossibility = 'add'
                this.differenceGk = possibility.teams - this.$store.state.all_goal_keepers.length
            } else if (possibility.teams < this.$store.state.all_goal_keepers.length) {
                this.modalContent = true
                this.choicePossibility = 'remove'
                this.differenceGk = this.$store.state.all_goal_keepers.length - possibility.teams
            } else {
                this.modalContent = null
            }
        },
        /**
         * @param {String} container 
         */
        // dropdown(container) {
        //     this.key = !this.key
        //     switch (container) {
        //         case 'availables':
        //             if (this.key) {
        //                 console.log('availables')
        //                 $('#availables').addClass('bg-danger')
        //             } else {
        //                 $('#availables').removeClass('bg-danger')
        //             }
        //             break
        //         case 'unavailables':
        //             if (this.key) {
        //                 $('.players-unavailables-wrapper').addClass('active')
        //             } else {
        //                 $('.players-unavailables-wrapper').removeClass('active')
        //             }
        //             break
        //     }
        // }
    },
    created() {
        this.$http
            .get(`${this.apiPath}/players/available_unavailable`)
            .then((res) => {
                this.setAllPlayersAvailables(res.data.all_players_availables)
                this.setAllPlayersUnavailables(res.data.all_players_unavailables)
                // store.commit('setAllPlayersAvailables', res.data.all_players_availables)
                // store.commit('setAllPlayersUnavailables', res.data.all_players_unavailables)
                if (this.allPossibilities.length == 0) {
                    this.setTeamsSettings(res.data.all_players_availables.length)
                }
                this.clearGoalKeepersProvisory()
            })
            .catch((err) => { console.log(err) })
    }
}
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