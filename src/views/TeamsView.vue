<template>
    <div class="container-fluid">
        <h1>
            TeamsView
            <span @click="controlTeamsEquiality">click</span>
        </h1>
        <!-- TODO make a table with name/nick_name/level.id -> points by player /level.name  -->
        <div class="row">
            <div v-for="teamObject, i in this.finalTeams" :key="i">
                <h6>Squadra {{ i + 1 }}
                    <span class="badge text-bg-primary mb-2">
                        Media: {{ teamObject.average }}
                    </span>
                </h6>
                <ul class="list-group mb-2">
                    <li v-for="player, j in teamObject.team" :key="j" class="list-group-item">
                        {{ player.name }}
                    </li>
                </ul>
            </div>
        </div>
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
            'finalTeams',
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
        controlTeamsEquiality() {
            var lastResult = this.setTeams()
            while (!lastResult) {
                lastResult = this.setTeams()
            }
            this.$store.state.finalTeams = this.teamsAndOwnAverages
            console.log("🚀 ~ file: TeamsView.vue:66 ~ controlTeamsEquiality ~ this.finalTeams:", this.finalTeams)
            return this.finalTeams
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
        this.controlTeamsEquiality()
    },
}
</script>