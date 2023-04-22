<template>
    <div>
        TeamsView
        <span @click="setAgain">click</span>
    </div>
</template>

<script>
import { mapState } from "vuex"
// import { mapMutations } from "vuex";
// import { mapActions } from 'vuex';

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
        /**
         * TODO  choose the range by averages from generalAverage
         * generalAverage % teams (3) -> 49 % 3 -> 1
         * !the problem is now in the average by teams.
         */
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
                // console.log("🚀 ~ file: TeamsView.vue:58 ~ setTeams ~ generalAverage:", generalAverage)
            }

            // console.log("🚀 ~ file: TeamsView.vue:57 ~ setTeams ~ recalcAverage:", recalcAverage)
            const idealAverage = Math.round(generalAverage / this.possibility.teams)
            let areEqual = this.teamsAndOwnAverages.every(c => { return c.average == idealAverage })
            return areEqual
        },
        setFinal() {
            var lastResult = this.setTeams()
            var counter = 0
            // while (!lastResult) {
            for (let i = 0; i < 10; i++) {
                lastResult = this.setTeams()
                counter++
            }
            console.log("🚀 ~ file: TeamsView.vue:58 ~ setFinal ~ lastResult:", lastResult)
            console.log("🚀 ~ file: TeamsView.vue:60 ~ setFinal ~ counter:", counter)
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