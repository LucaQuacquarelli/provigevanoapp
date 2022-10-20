<template>
    <div class="d-flex flex-wrap">
        <div class="d-flex col-12 p-2 justify-content-end">
            <h3 class="fw-bolder">
                Total {{ this.allPlayersCounter  }}
            </h3>
        </div>
        <div v-for="level in playersByLevel" :key="level.id" class="col-12 d-flex align-items-center flex-wrap mb-4 p-4 rounded-4" :class="backgroundColors(level.id)">
            <div class="col-6">
                <h2 class="text-white fw.bold">
                    {{ level.name }}
                </h2>
            </div>
            <div class="col-6 text-end">
                <h2 class="text-white fw.bold">
                    {{ level.players.length }}
                </h2>
            </div>
            <div class="col-12 d-flex justify-content-around flex-wrap">
                <div v-for="player in level.players" :key="player.id" class="col-5 d-flex my-3 justify-content-center">
                    <PlayerCard :player="player"/>
                </div>
            </div>
        </div>
        <!--TODO add computed to show this div or not  -->
        <div v-if="checkGoalkeepers">
        <div class="col-12 d-flex align-items-center flex-wrap mb-4 p-4 bg-dark bg-gradient rounded-4">
            <div class="col-12 d-flex justify-content-around flex-wrap">
                <div v-for="goalkeeper in allGoalkeepers" :key="goalkeeper.id" class="col-5 d-flex my-3 justify-content-center">
                    <PlayerCard :player="goalkeeper"/>
                </div>
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
            playersByLevel: null,
            allPlayersCounter : null,
            allGoalkeepers: ''
        }
    },
    computed: {
        backgroundColors() {
            const bootstrapClasses = {
                1 : 'bg-danger bg-gradient',
                2 : 'bg-warning bg-gradient',
                3 : 'bg-primary bg-gradient',
                4 : 'bg-success bg-gradient',
                5 : 'bg-dark bg-gradient',
            }
            return id => bootstrapClasses[id] 
        },
        checkGoalkeepers(){
            return this.allGoalkeepers.length > 0 ? true : false
        }
    },
    created() {
        this.$http
            .get(`${this.$store.getters.apiPath}/players/get_by_level`)
            .then((res) => {
                console.log("🚀 ~ file: SelectedPlayers.vue ~ line 39 ~ .then ~ res.data", res.data)
                this.playersByLevel = res.data.playersByLevel
                this.allPlayersCounter = res.data.counterPlayersAvailables
                this.allGoalkeepers = res.data.allGoalKeepersSelected
            })
            .catch((err) => {
                this.$store.state.serverModal = true
                this.$store.state.errServer = err.message
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