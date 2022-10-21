<template>
    <div>
        TeamsView
    </div>
</template>

<script>
export default {
    name: 'TeamsView',
    created() {
        if (this.$store.state.possibility == null) {
            this.$router.replace('/selected_players')
        } else {
            console.log("🚀 ~ file: TeamsView.vue ~ line 10 ~ possibility", this.$store.state.possibility)
            console.log("🚀 ~ file: TeamsView.vue ~ line 12 ~ created ~ state", this.$store.state.players_by_level)
            console.log("🚀 ~ file: TeamsView.vue ~ line 12 ~ created ~ state", this.$store.state.all_goal_keepers_selected)
            
        }
    }
}
</script>

<style>

</style>