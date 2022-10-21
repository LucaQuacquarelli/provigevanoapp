<template>
    <div class="d-flex flex-wrap position-relative">
        <div class="col-12 my-4">
            <input type="text" class="form-control" :placeholder="$t('general.search')"
                v-model="this.$store.state.inputSearch" @keyup="this.$store.dispatch('searchPlayers')">
        </div>
        <div class="col-12 d-flex flex-wrap align-items-start">
            <div class="col-12 mb-4">
                <div class="d-flex align-items-center mb-4">
                    <h6 class="d-flex align-items-center fw-bold">
                        {{ $t('players.availables') }}
                    </h6>
                    <span class="badge bg-dark ms-2">
                        {{ this.$store.state.availables_players_counter }}
                    </span>
                </div>
                <div v-for="player in this.$store.state.all_players" :key="player.id" :class="{'d-none' : !player.available}">
                    <label v-if="player.available" class="d-flex justify-content-between align-items-center p-4 mb-2 rounded-pill" :class="{'available' : player.available}" :for="player.id">
                        <input class="d-none" type="checkbox" :id="player.id" v-model="player.available" @change="setAvailability(player)"/>
                        <span class="fs-3 fw-bold">
                            {{ player.nick_name }}
                        </span>
                        <span class="badge fs-6" :class="player.role.name == 'goalkeeper' ? 'bg-warning' : 'bg-info'">
                            {{ roleAbbreviation(player.role.name) }}
                        </span>
                    </label>
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
                <div class="col-12 unavailable-container">
                    <div v-for="player in this.$store.state.all_players" :key="player.id" :class="{'d-none' : player.available}">
                        <label v-if="!player.available" class="d-flex justify-content-between align-items-center p-4 mb-2 rounded-pill" :class="{'unavailable' : !player.available}" :for="player.id">
                            <input class="d-none" type="checkbox" :id="player.id" v-model="player.available" @change="setAvailability(player)"/>
                            <span class="fs-3 fw-bold">
                                {{ player.nick_name }}
                            </span>
                            <span class="badge" :class="player.role.name == 'goalkeeper' ? 'bg-warning' : 'bg-info'">
                                {{ roleAbbreviation(player.role.name) }}
                            </span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 py-2 text-center btn-set-wrapper" v-if="availables">
            <router-link type="button" class="btn btn-outline-primary" to="selected_players">
                {{ $t('general.confirm') }}
            </router-link>
            <button class="ms-2 btn btn-danger" @click="clearAvailability">
                <i class="fa-solid fa-rotate"></i>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: "ChoosePlayers",
    components: {},
    data() {
        return {
            availables: false
        }
    },
    computed: {
        roleAbbreviation() {
            const abbreviation = {
                'goalkeeper': "PT",
                'player': "PL",
            }
            return role => abbreviation[role]
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
                    this.availables = this.$store.state.all_players.some(
                        (player) => player.available
                    )
                    this.$store.state.availables_players_counter = res.data.availables_players_counter
                    this.$store.state.unavailables_players_counter = res.data.unavailables_players_counter
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        clearAvailability(){
            this.$http
                .post(`${this.$store.getters.apiPath}/players_availability/clear`)
                .then((res) => {
                    this.$store.state.all_players = res.data
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    },
    created() {
        this.$http
            .get(`${this.$store.getters.apiPath}/players`)
            .then((res) => {
                this.$store.state.all_players = res.data.all_players
                this.$store.state.availables_players_counter = res.data.availables_players_counter
                this.$store.state.unavailables_players_counter = res.data.unavailables_players_counter
                this.availables = this.$store.state.all_players.some(
                    (player) => player.available
                )
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

    .unavailable-container {
        height: 480px;
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