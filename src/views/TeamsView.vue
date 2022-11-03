<template>
    <div>
        TeamsView
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
                this.all_goal_keepers.forEach(gk => {
                    var team = []
                    if (!team.includes(gk)) {
                        team.push(gk)
                    }
                    allTeams.push(team)
                })
                resolve(allTeams)
            })
        },
        setPlayersForTeams(allTeams){
            return new Promise((resolve) => {

                var pippo = []
                while (pippo.length < this.all_players_availables.length) {
                    this.all_players_availables.forEach(
                        player => {
                            player = Math.floor(Math.random() * this.all_players_availables.length)
                            if (!pippo.includes(player)) {
                                pippo.push(player)
                            }
                        }
                    )
                }
                console.log("🚀 ~ file: TeamsView.vue ~ line 49 ~ returnnewPromise ~ pippo", pippo)
                
                // const teams = [[1],[5],[9]]
                const spliceLength = pippo.length/this.possibility.teams

                for(var i = 0; i < allTeams.length; i++){
                    let team =  allTeams[i]
                    var teamPlayers = pippo.slice(0,spliceLength)
                    allTeams[i].push(...teamPlayers)
                    pippo.splice(0,spliceLength)
                    console.log(team, i)
                }


                // allTeams.forEach(
                //     team => {
                //         this.all_players_availables.forEach(
                //             player => {
                //                 if (team.length < this.possibility.playersForTeam) {
                //                     team.push(player)
                //                 }
                //             }
                //         )
                //     }
                // )
                resolve(allTeams)
            })
        },
        randomizeTeamsByAverage(allTeamsSorted) {
            console.log("🚀 ~ file: TeamsView.vue ~ line 62 ~ randomizeTeamsByAverage ~ allTeamsSorted", allTeamsSorted)
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
            console.log(averages);
        }
    },
    created() {
        if (this.$store.state.possibility == null) {
            this.$router.replace('/selected_players')
        } else {
            this.setTeamsByGoalkeepers()
                .then((allTeams) => {
                    this.setPlayersForTeams(allTeams)
                        .then((allTeamsSorted) => {
                            this.randomizeTeamsByAverage(allTeamsSorted)
                        })
                })
        }
    },
}
</script>

<style>

</style>