<template>
    <div class="d-flex flex-wrap">
        <div class="col-12 py-2 text-end" v-show="availables">
            <router-link type="button" class="btn btn-outline-primary" to="selected_players">
                {{ $t('general.confirm') }}
            </router-link>
            <button class="ms-2 btn btn-danger" @click="clearAvailability">
                <i class="fa-solid fa-rotate"></i>
            </button>
        </div>
        <div class="col-12 my-4">
            <input type="text" class="form-control" :placeholder="$t('general.search')"
                v-model="this.$store.state.inputSearch" @keyup="this.$store.dispatch('searchPlayers')">
        </div>
        <div class="col-12 d-flex align-items-start">
            <div class="col-6">
                <h6 class="d-flex align-items-center">
                    {{ $t('players.all_players') }}
                </h6>
                <div v-for="player in this.$store.state.all_players" :key="player.id" class="form-check"
                    :class="{'d-none' : player.available}">
                    <div v-if="!player.available">
                        <input class="form-check-input" type="checkbox" :id="player.id" v-model="player.available"
                            @change="setAvailability(player)" />
                        <label class="form-check-label me-2" :for="player.id">
                            {{ player.nick_name }}
                        </label>
                        <span class="badge" :class="player.role.name == 'goalkeeper' ? 'bg-warning' : 'bg-info'">
                            {{ roleAbbreviation(player.role.name) }}
                        </span>
                    </div>
                </div>
            </div>
            <div class="col-6">
                <div class="d-flex">
                    <h6>
                        {{ $t('players.availables') }}
                    </h6>
                    <span class="badge bg-dark ms-2">
                        {{ this.$store.state.availables_players_counter }}
                    </span>
                </div>
                <div v-for="player in this.$store.state.all_players" :key="player.id" class="form-check"
                    :class="{'d-none' : !player.available}">
                    <div v-if="player.available">
                        <input class="form-check-input" type="checkbox" :id="player.id" v-model="player.available"
                            @change="setAvailability(player)" />
                        <label class="form-check-label me-2" :for="player.id">
                            {{ player.nick_name }}
                        </label>
                        <span class="badge" :class="player.role.name == 'goalkeeper' ? 'bg-warning' : 'bg-info'">
                            {{ roleAbbreviation(player.role.name) }}
                        </span>
                    </div>
                </div>
            </div>
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
                    console.log(res);
                    // this.$store.state.availables_players_counter = res.data
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
                this.$store.state.all_players = res.data
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

</style>