<template>
    <div class="d-flex flex-wrap">
        <div class="d-flex col-12 p-2 justify-content-between align-items-center">
            <h3 class="fw-bolder">
                {{ $t('players.availables') }} {{ counterPlayersAvailables }}
            </h3>
            <router-link to="/teams">
                <!-- TODO TRANSLATE -->
                Sort Teams
            </router-link>
        </div>
        <div class="col-12 d-flex justify-content-around flex-wrap ">
            <div v-for="player in this.$store.state.all_players_availables" :key="player.id"
                class="col-5 d-flex my-3 justify-content-center">
                <PlayerCard :player="player" />
            </div>
        </div>
        <!-- ?Comment this container for the gks, because those are included in the first v-for. -->
        <!-- <div class="col-12 d-flex align-items-center flex-wrap mb-4 p-4 bg-dark bg-gradient rounded-4">
            <div class="col-12 d-flex justify-content-around flex-wrap">
                <div v-for="goalkeeper in this.$store.state.all_goal_keepers" :key="goalkeeper.id" class="col-5 d-flex my-3 justify-content-center">
                    <PlayerCard :player="goalkeeper"/>
                </div>
            </div>
        </div> -->
    </div>
</template>

<script>
import PlayerCard from '../components/PlayerCard.vue';
export default {
    name: "SelectedPlayers",
    components: {
        PlayerCard,
    },
    computed: {
        counterPlayersAvailables() {
            /**
             ** add wrong data, in this.$store.state.all_players_availables we found ALL, not just players, gks too.
             *  TODO make another query to divive the players and the goalkeepers availables.
             */
            // let counter = 0
            // if (Object.keys(this.$store.state.all_players_availables).length != 0 && this.$store.state.all_goal_keepers.length > 0) {
            //     counter = this.$store.state.all_players_availables.length + this.$store.state.all_goal_keepers.length
            // }
            // return counter
            return this.$store.state.all_players_availables.length 
        }
    },
    created() {
        if (Object.keys(this.$store.state.all_players_availables).length === 0 && this.$store.state.all_goal_keepers.length == 0){
            this.$router.replace("/choose_players")
        }
    }
}
</script>

<style lang="scss" scoped>
    .rounded {
        border-radius: 30px !important;
        border: 2px solid red;
    }
</style>