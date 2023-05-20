<template>
    <div class="container-fluid">
        <h1 class="d-flex justify-content-between align-items-center">
            {{ $t('teams.teams') }}
            <span class="btn btn-success" @click="controlBalancedTeams">
                <i class="fa-solid fa-repeat fa-xs"></i>
                &nbsp;{{ $t('buttons.regenerate') }}
            </span>
        </h1>
        <div class="row">
            <div v-for="teamObject, i in this.finalTeams" :key="i" class="py-3">
                <div class="d-flex justify-content-between mb-2">
                    <h6>{{ $t('teams.team') }} {{ i + 1 }}</h6>
                    <span class="badge text-bg-primary">
                        {{ $t('teams.media') }}:&nbsp; {{ teamObject.average }}
                    </span>
                </div>
                <table class="table">
                    <thead class="table-light">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">{{ $t('form.name') }}</th>
                            <th scope="col">{{ $t('form.role') }}</th>
                            <th scope="col">{{ $t('form.nick_name') }}</th>
                            <th scope="col">{{ $t('form.level') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="player, j in this.orderByLevel(teamObject.team)" :key="j">
                            <th scope="row">{{ j + 1 }}</th>
                            <td>{{ player.name }}</td>
                            <td>
                                <span class="badge" :class="player.role.name == 'goalkeeper' ? 'bg-dark' : 'bg-info'">
                                    {{ roleAbbreviation(player.role.name) }}
                                </span>
                            </td>
                            <td>{{ player.nick_name }}</td>
                            <td>
                                <span class="badge" :class="this.badgeByLevel(player.level.name)">
                                    {{ player.level.name }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
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
        badgeByLevel() {
            const badgeClass = {
                'basso': "bg-success",
                'medio-basso': "bg-success",
                'medio': "bg-warning",
                'medio-alto': "bg-warning",
                'alto': "bg-danger",
            }
            return level => badgeClass[level]
        },
        orderByLevel() {
            return team => team.sort((a, b) => a.level.percentage - b.level.percentage)
        },
        roleAbbreviation() {
            const abbreviation = {
                'goalkeeper': "PT",
                'player': "PL",
            }
            return role => abbreviation[role]
        },
    },
    methods: {
        setTeams() {
            const justPlayersNumber = this.possibility.playersForTeam - 1
            const sortedPlayers = [...this.sortRandomAllPlayersAvailables()]
            const completedTeams = []
            for (let i = 0; i < this.possibility.teams; i++) {
                var allPlayersForTeams = []
                var playersForTeam = sortedPlayers.splice(0, justPlayersNumber)
                allPlayersForTeams.push(this.all_goal_keepers[i])
                allPlayersForTeams.push(...playersForTeam)
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
        controlBalancedTeams() {
            var lastResult = this.setTeams()
            while (!lastResult) {
                lastResult = this.setTeams()
            }
            this.$store.state.finalTeams = this.teamsAndOwnAverages
            console.log("🚀 ~ file: TeamsView.vue:66 ~ controlBalancedTeams ~ this.finalTeams:", this.finalTeams)
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
        this.controlBalancedTeams()
    },
}
</script>