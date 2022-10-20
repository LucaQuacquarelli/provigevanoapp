<template>
    <div class="d-flex flex-wrap">
        <div class="col-12 py-2 text-end" v-show="availables">
            <router-link type="button" class="btn btn-outline-primary" to="selected_players">
                {{ $t('general.confirm') }}
            </router-link>
        </div>
        <div class="col-12 d-flex align-items-start">
            <div class="col-6">
                <h6 class="d-flex align-items-center">
                    {{ $t('players.all_players') }}
                </h6>
                <div v-for="player in this.$store.state.all_players" :key="player.id" class="form-check" :class="{'d-none' : player.available}">
                    <div v-if="!player.available">
                        <input class="form-check-input" type="checkbox" :id="player.id" v-model="player.available" @change="setAvailability(player)"/>
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
                <h6>
                    {{ $t('players.availables') }}
                </h6>
                <div v-for="player in this.$store.state.all_players" :key="player.id" class="form-check" :class="{'d-none' : !player.available}">
                    <div v-if="player.available">
                        <input class="form-check-input" type="checkbox" :id="player.id" v-model="player.available" @change="setAvailability(player)"/>
                        <label class="form-check-label" :for="player.id">
                            {{ player.nick_name }}
                            &nbsp;
                            <span class="badge" :class="player.role.name == 'goalkeeper' ? 'bg-warning' : 'bg-info'">
                                {{ roleAbbreviation(player.role.name) }}
                            </span>
                        </label>
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
        };
    },
    computed: {
        roleAbbreviation() {
            const abbreviation = {
                'goalkeeper' : "PT",
                'player' : "PL",
            }
            return role => abbreviation[role]
        }
    },
    methods: {
        setAvailability (player) {
            this.$http
                .post(`${this.$store.getters.apiPath}/players_availability`,
                    {
                        id: player.id,
                        available: player.available
                    }
                )
                .then(() => {
                    this.availables = this.$store.state.all_players.some(
                            (player) => player.available
                        )
                })
                .catch((err) => {
                    console.log(err);
                }) 
        },
        /**
         *!NOT USED YET
         */
        update() {
            this.$http.get(`${this.$store.getters.apiPath}/update_player`)
                .then((res) => {
                    console.log(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
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
                console.log(err);
            }) 
    },
};
</script>

<style lang="scss" scoped>

</style>