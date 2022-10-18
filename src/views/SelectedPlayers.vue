<template>
    <div class="d-flex flex-wrap">
        <div v-for="level in playersByLevel" :key="level.id" class="col-12 d-flex align-items-center flex-wrap mb-4 p-4 rounded">
            <div class="col-6">
                <h2>
                    {{ level.name }}
                </h2>
            </div>
            <div class="col-6 text-end">
                <h2>
                    {{ level.players.length }}
                </h2>
            </div>
            <div class="col-12 d-flex justify-content-around flex-wrap">
                <div v-for="player in level.players" :key="player.id" class="col-5 d-flex my-3 justify-content-center">
                    <PlayerCard :level="level" :player="player"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import PlayerCard from '../components/PlayerCard.vue';
export default {
    name: "SelectedPlayers",
    components: {
        PlayerCard
    },
    data() {
        return {
            api_protocol: this.$store.state.config.api_protocol,
            api_url: this.$store.state.config.api_url,
            api_port: this.$store.state.config.api_port,
            playersByLevel: null
        }
    },
    created() {
        this.$http
            .get(`${this.api_protocol}${this.api_url}:${this.api_port}/players/get_by_level`)
            .then((res) => {
                console.log(res.data);
                this.playersByLevel = res.data
            })
            .catch((err) => {
                console.log(err);
            }) 
    }
}
</script>

<style lang="scss" scoped>
    .rounded {
        border-radius: 30px !important;
        border: 2px solid red;
    }
</style>