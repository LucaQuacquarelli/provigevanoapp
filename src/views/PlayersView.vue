<template>
    <div class="container">
        <div class="row">
            <div class="col-6">
                <div v-for="player in all_players" :key="player.id" class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"
                        v-model="player.available" @change="checkAvailabilitySinglePlayer(player)" />
                    <label class="form-check-label" for="flexCheckDefault">{{player.name}}</label>
                </div>
            </div>
            <div class="col-6">
                <div v-for="player in players_availables" :key="player.id" class="form-check text-white bg-success">
                    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"
                        :checked="player.available == true ? true : false"
                        @change="checkAvailabilitySinglePlayer(player)" />
                    <label class="form-check-label" for="flexCheckDefault">{{player.name}}</label>
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
            all_players: [],
            players_availables: [],
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
                this.players_availables.push(player);
            }
        }
    },
    created() {
        this.$http.get(`${this.api_protocol}${this.api_url}:${this.api_port}/players`)
            .then((res) => {
                console.log(res.data);
                this.all_players = res.data;
            })
            .catch((err) => {
                console.log(err);
            });
    },
};
</script>

<style lang="scss" scoped>

</style>