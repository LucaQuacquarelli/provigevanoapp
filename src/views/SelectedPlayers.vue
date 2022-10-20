<template>
    <div class="d-flex flex-wrap">
        <div class="d-flex col-12 p-2 justify-content-between align-items-center">
            <h3 class="fw-bolder">
                {{ $t('players.availables') }} {{ this.$store.state.availables_players_counter  }}
            </h3>
            <span class="ms-2 btn btn-primary" @click="setGame">
                Imposta partita
            </span>
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

        <transition name="fade-modal">
            <modal-slide v-if="this.$store.state.modalSlide" @close="this.$store.state.modalSlide = false">
                <template v-slot:header>
                    <div class="modal-header d-flex flex-wrap py-2 px-4">
                        <div class="col-12 d-flex justify-content-between align-items-center">
                            <span class="text-primary" @click="this.$store.state.modalSlide = false">
                                {{ $t('general.cancel') }}
                            </span>
                            <span class="text-primary">
                                {{ $t('general.end') }}
                            </span>
                        </div>
                    </div>
                </template>
                <template v-slot:body>
                    <div class="modal-body d-flex flex-wrap py-2 px-4">
                        <div class="col-12 mb-3">
                            <h3 class="fw-bolder">
                                {{ $t('players.availables') }} {{ this.$store.state.availables_players_counter }}
                            </h3>
                        </div>
                        <div class="col-12 d-flex flex-wrap">
                            <div class="col-12">
                                <h4>
                                    {{ $t('teams.options') }}
                                </h4>
                            </div>
                            <div class="col-12 d-flex my-2 justify-content-center" v-for="(possibility, index) in allPossibilities" :key="index">
                                <button class="btn btn-primary btn-lg">
                                    {{ possibility.teams}} {{ $t("teams.teams") }} {{ $t("teams.from") }} {{ possibility.playersForTeam }} {{ $t("teams.players") }}
                                </button>
                            </div>
                        </div>
                    </div>
                </template>
            </modal-slide>
        </transition>
    </div>
</template>

<script>
import PlayerCard from '../components/PlayerCard.vue';
import ModalSlide from '../components/ModalSlide.vue';
export default {
    name: "SelectedPlayers",
    components: {
    PlayerCard,
    ModalSlide
},
    data() {
        return {
            playersByLevel: null,
            allGoalkeepers: '',
            allPossibilities: []
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
    methods: {
        between(x, min, max) {
            return x >= min && x <= max;
        },
        sortTeams(players) {
            if(this.allPossibilities.length != 0){
                return
            }
            const minPlayers = 5;
            const maxPlayers = 9
            for (let i = 2; i < 5; i++) {
                const teamObj = {}
                var playersForTeam = players / i
                var teams = players / playersForTeam
                if (Number.isInteger(teams) && Number.isInteger(playersForTeam) && this.between(playersForTeam, minPlayers, maxPlayers)) {
                    teamObj.teams = teams
                    teamObj.playersForTeam = playersForTeam;
                    this.allPossibilities.push(teamObj)
                }
            }
            console.log(this.allPossibilities);
        },
        setGame() {
            this.$store.state.modalSlide = true
            this.sortTeams(this.$store.state.availables_players_counter)
        }
    },
    created() {
        this.$http
            .get(`${this.$store.getters.apiPath}/players/get_by_level`)
            .then((res) => {
                this.playersByLevel = res.data.playersByLevel
                // this.allPlayersCounter = res.data.counterPlayersAvailables;
                this.$store.state.availables_players_counter = res.data.counterPlayersAvailables
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