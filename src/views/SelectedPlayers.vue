<template>
    <ul>
        <li v-for="player in this.$store.state.all_players" :key="player.id" :class="{'d-none' : !player.available}">
            {{ player.name }}
        </li>
    </ul>
</template>

<script>
export default {
    name: "SelectedPlayers"
};
</script>

<style>

</style>