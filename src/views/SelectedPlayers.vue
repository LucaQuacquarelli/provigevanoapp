<template>
    <div class="container">
        <ul>
            <li v-for="player in players_availables" :key="player.id">{{player.name}}</li>
        </ul>

    </div>
</template>

<script>
export default {
    name: "SelectedPlayers",
    data() {
        return {
            players_availables: this.$store.state.players_availables
        };
    },
    // props: ['selected_players']
};
</script>

<style>

</style>