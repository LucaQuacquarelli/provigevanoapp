<template>
    <div class="d-flex flex-wrap">
        <div class="col-12 py-2 text-center btn-set-wrapper" v-if="this.$store.state.availables_players_counter >= 10">
            <router-link type="button" class="btn btn-outline-primary" to="/selected_players">
                {{ $t('general.confirm') }}
            </router-link>
        </div>
        <div class="col-12 my-4">
            <input type="text" class="form-control" :placeholder="$t('general.search')" key="" v-model="this.$store.state.inputSearch" @keyup="this.$store.dispatch('searchPlayers')">
        </div>
        <div class="col-12 d-flex flex-wrap align-items-start">
            <div class="col-12 mb-4" v-if="this.$store.state.availables_players_counter > 0">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h6 class="d-flex align-items-center fw-bold">
                        {{ $t('players.availables') }}
                        <span class="badge bg-dark ms-2">
                            {{ this.$store.state.availables_players_counter }}
                        </span>
                    </h6>
                    <button class="ms-2 btn btn-danger" @click="clearAvailability">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
                <div class="availables-container">
                    <div v-for="player in this.$store.state.all_players" :key="player.id" :class="{'d-none' : !player.available}">
                        <label v-if="player.available" class="d-flex justify-content-between align-items-center p-4 mb-2 rounded-pill" :class="{'available' : player.available}" :for="player.id">
                            <input class="d-none" type="checkbox" :id="player.id" v-model="player.available" @change="setAvailability(player)"/>
                            <span class="fs-3 fw-bold">
                                {{ player.nick_name }}
                            </span>
                            <span class="d-flex align-items-center">
                                <span class="badge fs-6 bg-dark me-2">
                                    {{ player.level.percentage }}
                                </span>
                                <span class="badge fs-6" :class="player.role.name == 'goalkeeper' ? 'bg-warning' : 'bg-info'">
                                    {{ roleAbbreviation(player.role.name) }}
                                </span>
                            </span>
                        </label>
                    </div>
                </div>
            </div>
            <div class="col-12">
                <div class="d-flex align-items-center mb-4">
                    <h6 class="d-flex align-items-center fw-bold">
                        {{ $t('players.all_players') }}
                    </h6>
                    <span class="badge bg-dark ms-2">
                        {{ this.$store.state.unavailables_players_counter }}
                    </span>
                </div>
                <div class="unavailables-container">
                    <div v-for="player in this.$store.state.all_players" :key="player.id" :class="{'d-none' : player.available}">
                        <label v-if="!player.available" class="d-flex justify-content-between align-items-center p-4 mb-2 rounded-pill" :class="{'unavailable' : !player.available}" :for="player.id">
                            <input class="d-none" type="checkbox" :id="player.id" v-model="player.available" @change="setAvailability(player)"/>
                            <span class="fs-3 fw-bold">
                                {{ player.nick_name }}
                            </span>
                            <span class="d-flex align-items-center">
                                <span class="badge fs-6 bg-dark me-2">
                                    {{ player.level.percentage }}
                                </span>
                                <span class="badge fs-6" :class="player.role.name == 'goalkeeper' ? 'bg-warning' : 'bg-info'">
                                    {{ roleAbbreviation(player.role.name) }}
                                </span>
                            </span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <transition name="fade-modal">
        <modal v-if="this.$store.state.possibilityModal" @close="this.$store.state.possibilityModal = false">
            <template v-slot:header>
                <div class="modal-header bg-danger text-light py-2 px-4">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-globe me-2"></i>
                        <h5 class="modal-title text-white">
                            alf
                            <!-- TODO esegui computed -->
                            {{ chooseContentModalPossibility(checkOnPossibilities) }}
                        </h5>
                    </div>
                </div>
            </template>
        </modal>
    </transition>
</template>

<script>
import Modal from '../components/Modal.vue'
export default {
    name: "ChoosePlayers",
    components: {
        Modal
    },
    data() {
        return {
            allPossibilities: []
        }
    },
    computed: {
        roleAbbreviation() {
            const abbreviation = {
                'goalkeeper': "PT",
                'player': "PL",
            }
            return role => abbreviation[role]
        },
        chooseContentModalPossibility(){
            const response = {
                'add': "Aggiungi",
                'remove': "Togli",
                'same': "So uguali",
            }
            return pippo => response[pippo];
        }
    },
    methods: {
        setAvailability(player) {
            this.$http
                .post(`${this.$store.getters.apiPath}/players_availability`,
                    {
                        id: player.id,
                        available: player.available
                    }
                )
                .then((res) => {
                    this.$store.state.availables_players_counter = res.data.availables_players_counter
                    this.$store.state.unavailables_players_counter = res.data.unavailables_players_counter
                    this.$store.state.all_goal_keepers_counter = res.data.all_goal_keepers_counter
                    this.sortTeams(this.$store.state.availables_players_counter).then(
                        () => {
                            this.checkOnPossibilities()
                        }
                    )
                })
                .catch((err) => {
                    // TODO modal errors
                    console.log(err)
                })
        },
        clearAvailability(){
            this.$http
                .post(`${this.$store.getters.apiPath}/players_availability/clear`)
                .then((res) => {
                    this.$store.state.all_players = res.data.all_players
                    this.$store.state.availables_players_counter = res.data.availables_players_counter
                    this.$store.state.unavailables_players_counter = res.data.unavailables_players_counter
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        between(x, min, max) {
            return x >= min && x <= max;
        },
        sortTeams(players) {
            return new Promise((resolve) => {
                this.allPossibilities = []
                const minPlayers = 5;
                const maxPlayers = 9
                for (let i = 2; i < 5; i++) {
                    var playersForTeam = players / i
                    var teams = players / playersForTeam
                    if (Number.isInteger(teams) && Number.isInteger(playersForTeam) && this.between(playersForTeam, minPlayers, maxPlayers)) {
                        const possibilitiesObj = {
                            teams,
                            playersForTeam
                        }
                        this.allPossibilities.push(possibilitiesObj)
                    }
                }
                resolve()
            })
        },
        checkOnPossibilities() {
            var response = []
            this.allPossibilities.forEach(
                possibility => {
                    if (possibility.teams > this.$store.state.all_goal_keepers_counter) {
                        this.$store.state.possibilityModal = true
                        response.push('add')
                    } else if (possibility.teams < this.$store.state.all_goal_keepers_counter) {
                        this.$store.state.possibilityModal = true
                        response.push('remove')
                    } else {
                        this.$store.state.possibilityModal = true
                        response.push('same')
                    }
                }
            )
            return response
        },
    },
    created() {
        this.$http
            .get(`${this.$store.getters.apiPath}/players`)
            .then((res) => {
                this.$store.state.all_players = res.data.all_players
                this.$store.state.unavailables_players_counter = res.data.unavailables_players_counter
                this.$store.state.availables_players_counter = res.data.availables_players_counter
            })
            .catch((err) => {
                console.log(err)
            })
    },
}
</script>

<style lang="scss" scoped>

    .position-relative {
        .btn-set-wrapper {
            position: absolute;
            bottom: 0;
            left: 0;
        }
    }

    .unavailables-container, 
    .availables-container {
        min-height: 100px;
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
</style>