<template>
    <div>
        TeamsView
        <span @click="setAgain">click</span>
    </div>
</template>

<script>
import { mapState } from "vuex"
export default {
    name: 'TeamsView',
    data() {
        return {
            // sumAvailablesAndGoalkeepers: this.all_players_availables.length + this.all_goal_keepers.length,
            // numberOfTeams : this.possibility.teams,
            // numberOfPlayersForTeam : this.possibility.players
        }
    },
    computed:{
        ...mapState([
            'all_players_availables',
            'all_goal_keepers',
            'possibility'
        ]),
    },
    methods: {
        setTeamsByGoalkeepers() {
            /**
             * !Somma due array -> tutti i disponibili insiem ai portieri
             ** Creerà n squadre (array) in base ai goalkeepers e alla length di possibility.players
             ** Ottenere la media dei players.level per ogni squadra generata
             * ? if ( media  )
             */
            return new Promise((resolve) => {
                const allTeams = []
                this.all_goal_keepers.forEach(
                    gk => {
                        var team = []
                        if (!team.includes(gk)) {
                            team.push(gk)
                        }
                        allTeams.push(team)
                    }
                )
                resolve(allTeams)
            })
        },
        setPlayersForTeams(allTeams){
            return new Promise((resolve) => {
                var oldAvailables = [...this.all_players_availables]
                oldAvailables.sort(()=> Math.random() - 0.5)
                const teamLength = oldAvailables.length/this.possibility.teams
                allTeams.forEach(
                    team => {
                        var playersForTeam = oldAvailables.slice(0, teamLength)
                        team.push(...playersForTeam)
                        oldAvailables.splice(0, teamLength)
                    }
                )
                resolve(allTeams)
            })
        },
        getTeamsAverages(allTeamsSorted) {
            return new Promise((resolve) => {
                var averages = []
                allTeamsSorted.forEach(
                    team => {
                        let average = 0
                        team.forEach(
                            player => {
                                average += player.level.percentage
                            }
                        )
                        averages.push(average)
                    }
                )
                resolve({
                    allTeamsSorted,
                    averages
                })
            } )
        },
        randomizeTeamsByAverage(getTeamsAveragesResponse) {
            var sum = 0
            getTeamsAveragesResponse.averages.forEach(
                average => {
                    sum += average
                }
            )
            console.log("🚀 ~ file: TeamsView.vue ~ line 85 ~ randomizeTeamsByAverage ~ sum", sum/this.possibility.teams)
        },
        setAgain() {
            this.setTeamsByGoalkeepers()
                .then((allTeams) => {
                    this.setPlayersForTeams(allTeams)
                        .then((allTeamsSorted) => {
                            this.getTeamsAverages(allTeamsSorted)
                                .then((results) => {
                                    this.randomizeTeamsByAverage(results)
                                })
                        })
                })
        }
    },
    created() {
        if (this.$store.state.possibility == null || Object.keys(this.all_players_availables).length === 0) {
            this.$router.replace('/choose_players')
        } else {
            this.setTeamsByGoalkeepers()
                .then((allTeams) => {
                    this.setPlayersForTeams(allTeams)
                        .then((allTeamsSorted) => {
                            this.getTeamsAverages(allTeamsSorted)
                                .then((results) => {
                                    this.randomizeTeamsByAverage(results)
                                })
                        })
                })
        }
    },
}
</script>

<style>

</style>