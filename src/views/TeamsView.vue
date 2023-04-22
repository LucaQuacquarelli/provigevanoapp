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
            teamsAndOwnAverages: null,
        }
    },
    computed: {
        ...mapState([
            'all_players_availables',
            'all_goal_keepers',
            'possibility',
            'lastResult',
        ]),
    },
    methods: {
        setTeams() {
            const justPlayersNumber = this.possibility.playersForTeam - 1
            const sortedPlayers = [...this.sortRandomAllPlayersAvailables()]
            const completedTeams = []
            for (let i = 0; i < this.possibility.teams; i++) {
                var allPlayersForTeams = []
                var playersForTeam = sortedPlayers.splice(0, justPlayersNumber)
                allPlayersForTeams.push(...playersForTeam)
                allPlayersForTeams.push(this.all_goal_keepers[i])
                completedTeams.push(allPlayersForTeams)
            }

            this.teamsAndOwnAverages = []
            completedTeams.forEach(team => {
                let singleTeamAverage = 0
                team.forEach(player => {
                    singleTeamAverage += player.level.percentage
                })
                this.teamsAndOwnAverages.push({ team: team, average: singleTeamAverage })
            })

            var generalAverage = this.teamsAndOwnAverages.reduce((acc, curr) => { return acc += curr.average }, 0)
            if (generalAverage % this.possibility.teams > 0) {
                const differenceToBeEqual = generalAverage % this.possibility.teams
                generalAverage = generalAverage - differenceToBeEqual
            }

            const idealAverage = Math.round(generalAverage / this.possibility.teams)
            let areEqual = this.teamsAndOwnAverages.every(c => { return c.average == idealAverage || c.average == idealAverage + 1 })
            return areEqual
        },
        setFinal() {
            var lastResult = this.setTeams()
            while (!lastResult) {
                lastResult = this.setTeams()
            }
            return this.teamsAndOwnAverages
        },
        sortRandomAllPlayersAvailables() {
            return this.all_players_availables.filter(player => {
                return player.role.name == 'player'
            }).sort(() => Math.random() - 0.5)
        },
    },
    created() {
        if (this.$store.state.possibility == null || Object.keys(this.all_players_availables).length === 0) {
            this.$router.replace('/choose_players')
        }
        this.$store.state.lastResult = false
        this.setFinal()
    },
}
</script>