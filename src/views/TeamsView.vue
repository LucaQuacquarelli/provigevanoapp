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
            return new Promise((resolve) => {
                const allTeams = []
                const all_goal_keepers = this.all_players_availables.filter( player => {
                    return  player.role.name == 'goalkeeper'
                })
                all_goal_keepers.forEach(
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
                const oldAvailables = this.all_players_availables.filter(player => {
                    return player.role.name == 'player';
                })
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
        getSumPlayersPercentage(allTeamsSorted) {
            return new Promise((resolve) => {
                let sum = 0
                let averages = []
                this.all_players_availables.forEach(player => {
                    sum += player.level.percentage
                })

                allTeamsSorted.forEach( team => {
                    let average = 0
                    team.forEach(player=>{
                        average += player.level.percentage
                    })
                    averages.push(average)
                })

                resolve({
                    allTeamsSorted,
                    sum,
                    averages
                })
            })
        },
        // setAgain() {
        //     this.setTeamsByGoalkeepers().then((allTeams) => {
        //         this.setPlayersForTeams(allTeams).then((allTeamsSorted) => {
        //             this.getSumPlayersPercentage(allTeamsSorted).then((results) => {
        //             console.log("🚀 ~ file: TeamsView.vue ~ line 88 ~ this.getSumPlayersPercentage ~ results", results)
        //             })
        //         })
        //     })
        // }
    },
    created() {
        if (this.$store.state.possibility == null || Object.keys(this.all_players_availables).length === 0) {
            this.$router.replace('/choose_players')
        } else {
            this.setTeamsByGoalkeepers().then((allTeams) => {
                this.setPlayersForTeams(allTeams).then((allTeamsSorted) => {
                    this.getSumPlayersPercentage(allTeamsSorted).then((results) => {
                    console.log("🚀 ~ file: TeamsView.vue ~ line 102 ~ this.getSumPlayersPercentage ~ results", results.averages)
                    const avgForTeam = Math.round(results.sum/this.possibility.teams)
                    const equal = results.averages.some(average => average > avgForTeam)
                    console.log("🚀 ~ file: TeamsView.vue ~ line 104 ~ this.getSumPlayersPercentage ~ equal", equal ? 'non sono equilibrate' : 'sono equilibrate')
                    })
                })
            })
        }
    },
}
</script>

<style>

</style>