<template>
    <div class="container">
        <div class="py-2 d-flex justify-content-end">
            <router-link type="button" class="btn btn-outline-primary" to="selected_players">
                Done
            </router-link>
        </div>
        <div class=" row">
            <div class="col-6">
                <h6 class="card-title">Tutti i giocatori</h6>
                <div v-for="player in all_players" :key="player.id" class="form-check"
                    :class="{'d-none': player.available }">
                    <input class="form-check-input" type="checkbox" value="" :id="player.id" v-model="player.available"
                        @change="checkAvailabilitySinglePlayer(player)" />
                    <label class="form-check-label" :for="player.id">{{player.name}}</label>
                </div>
            </div>
            <div v-if="players_availables_store.length > 0" class="col-6">
                <h6 class="card-title">Disponibili</h6>
                <div v-for="player in players_availables_store" :key="player.id" class="form-check"
                    :class="{'d-none': !player.available }">
                    <input class="form-check-input" type="checkbox" :id="player.id" :checked="player.available" />
                    <label class="form-check-label" :for="player.id">{{player.name}}</label>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: "PlayersView",
    components: {},
    data() {
        return {
            api_protocol: this.$store.state.config.api_protocol,
            api_url: this.$store.state.config.api_url,
            api_port: this.$store.state.config.api_port,
            players_availables_store: this.$store.state.players_availables,
        };
    },
    methods: {
        /**
         *!NOT USED YET
         */
        update() {
            this.$http.get(`${this.api_protocol}${this.api_url}:${this.api_port}/update_player`)
                .then((res) => {
                    console.log(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        checkAvailabilitySinglePlayer(player) {
            if (player.available == true) {
                if (!this.players_availables_store.includes(player)) {
                    this.$store.commit('addAvailableplayer', player);
                }
            } else if (player.available == false) {
                this.$store.commit('removeSelectedPlayer', player);
            }
            console.log(this.players_availables_store);
        },
    },
    computed: {
        ...mapGetters({
            all_players: 'getPlayers'
        }),
    },
    created() {
        this.$store.dispatch("fetchAllPlayers");
    },
};
</script>

<style lang="scss" scoped>

</style>