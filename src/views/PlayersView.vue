<template>
    <div class="container">
        <!-- TODO try to pass object to router view for make the edit form -->
        <!-- <div v-for="player,i in all_players" :key="i" class="list-group">
            <div class="input-group-text bg-light">
                <input class="form-check-input mt-0" type="checkbox" v-model="player.available">
                <router-link class="list-group-item" :to="{
                name: 'EditPlayer',
                // params: {player: JSON.stringify(player)}}
                // query: {item: player}}
                }">{{ player.name }}
                </router-link>
            </div>
        </div> -->

        <div v-for="player in all_players" :key="player.id" class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" v-model="player.available" />
            <label class="form-check-label" for="flexCheckDefault">{{player.name}}</label>
        </div>

        <div v-for="player in players_availables" :key="player.id" class="form-check bg-danger">
            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" v-model="player.available" />
            <label class="form-check-label" for="flexCheckDefault">{{player.name}}</label>
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
    watch: {
        all_players: {
            handler: function (val, oldVal) {
                if (val == oldVal) {
                    console.log("🚀 ~ file: PlayersView.vue ~ line 69 ~ val", val)
                }
            },
            deep: true
        }
    },
};
</script>

<style lang="scss" scoped>

</style>