<template>
    <div class="d-flex flex-wrap">
        <div class="d-flex col-12 p-2 justify-content-between align-items-center">
            <h3 class="fw-bolder">
                {{ $t('players.availables') }} {{ this.$store.state.availables_players_counter  }}
            </h3>
            <span class="ms-2 btn btn-primary" @click="setGame">
                Impostazioni partita
            </span>
        </div>
        <div v-for="level in this.$store.state.players_by_level" :key="level.id" class="col-12 d-flex align-items-center flex-wrap mb-4 p-4 rounded-4" :class="backgroundColors(level.id)">
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
        <div v-if="checkGoalkeepers">
            <div class="col-12 d-flex align-items-center flex-wrap mb-4 p-4 bg-dark bg-gradient rounded-4">
                <div class="col-12 d-flex justify-content-around flex-wrap">
                    <div v-for="goalkeeper in this.$store.state.all_goal_keepers_selected" :key="goalkeeper.id" class="col-5 d-flex my-3 justify-content-center">
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
                                <button @click="setTeams(possibility)" class="btn btn-primary btn-lg">
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
            return this.$store.state.all_goal_keepers_selected.length > 0 ? true : false
        }
    },
    methods: {
        setGame() {
            this.$store.state.modalSlide = true
            this.sortTeams(this.$store.state.availables_players_counter)
        },
        setTeams(possibility) {
            this.$store.state.possibility = possibility
            this.$router.replace('/teams')
        }
    },
    created() {
        this.$http
            .get(`${this.$store.getters.apiPath}/players/get_by_level`)
            .then((res) => {
                this.$store.state.players_by_level = res.data.players_by_level
                this.$store.state.availables_players_counter = res.data.availables_players_counter
                this.$store.state.all_goal_keepers_selected = res.data.all_goal_keepers_selected
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