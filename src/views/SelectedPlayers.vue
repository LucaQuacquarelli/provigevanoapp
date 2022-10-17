<template>
    <ul>
        <li v-for="player in players_availables" :key="player.id" :class="{'d-none' : !player.available}">
            {{ player.name }}
        </li>
    </ul>
</template>

<script>
export default {
    name: "SelectedPlayers",
    data() {
        return {
            api_protocol: this.$store.state.config.api_protocol,
            api_url: this.$store.state.config.api_url,
            api_port: this.$store.state.config.api_port,
            players_availables: null
        }
    },
    created() {
        this.$http
            .get(`${this.api_protocol}${this.api_url}:${this.api_port}/players/get/availables`)
            .then((res) => {
                console.log(res.data);
                this.players_availables = res.data
            })
            .catch((err) => {
                console.log(err);
            }) 
    }
}
</script>

<style>

</style>