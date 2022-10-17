<template>
    <div class="d-flex flex-wrap">
        <div class="col-12 py-2 text-end" v-show="availables">
            <router-link type="button" class="btn btn-outline-primary" to="selected_players">
                Done
            </router-link>
        </div>
        <div class="col-12 d-flex align-items-start">
            <div class="col-6">
                <h6 class="d-flex align-items-center">
                    Tutti i giocatori
                </h6>
                <div v-for="player in this.$store.state.all_players" :key="player.id" class="form-check" :class="{'d-none' : player.available}">
                    <div v-if="!player.available">
                        <input class="form-check-input" type="checkbox" :id="player.id" v-model="player.available" @change="setAvailability(player)"/>
                        <label class="form-check-label" :for="player.id">
                            {{ player.name }}
                        </label>
                    </div>
                </div>
            </div>
            <div class="col-6">
                <h6 class="card-title">
                    Disponibili
                </h6>
                <div v-for="player in this.$store.state.all_players" :key="player.id" class="form-check" :class="{'d-none' : !player.available}">
                    <div v-if="player.available">
                        <input class="form-check-input" type="checkbox" :id="player.id" v-model="player.available" @change="setAvailability(player)"/>
                        <label class="form-check-label" :for="player.id">
                            {{ player.name }}
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "PlayersView",
    components: {},
    data() {
        return {
            api_protocol: this.$store.state.config.api_protocol,
            api_url: this.$store.state.config.api_url,
            api_port: this.$store.state.config.api_port,
            availables: false
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
        setAvailability (player) {
            this.$http
                .post(`${this.api_protocol}${this.api_url}:${this.api_port}/players_availability`,
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
        }
    },
    created() {
        this.$http
            .get(`${this.api_protocol}${this.api_url}:${this.api_port}/players`)
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