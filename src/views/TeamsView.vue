<template>
    <div>
        TeamsView
        <span @click="setAgain">click</span>
    </div>
</template>

<script>
import { mapState } from "vuex";
export default {
    name: 'TeamsView',
    data() {
        return {
            teamsSorted: [],
            lastAverages: []
        };
    },
    computed: {
        ...mapState([
            'all_players_availables',
            'all_goal_keepers',
            'possibility',
            'lastResult'
        ]),
    },
    methods: {
        /**
         ** This function returns an array of n arrays, just with the goalkeeper for every single team.
         ** Example: 2 teams, [[gk1],[gk2]]
         * @return {Array} - array of arrays
         */
        setTeamsByGoalkeepers() {
            return new Promise((resolve) => {
                const teamsByGoalkeepers = [];
                this.all_goal_keepers.forEach(
                    goalKeeper => {
                        var team = [];
                        if (!team.includes(goalKeeper)) {
                            team.push(goalKeeper);
                        }
                        teamsByGoalkeepers.push(team);
                    }
                );
                resolve(teamsByGoalkeepers);
            });
        },
        setPlayersForTeams(allTeams) {
            return new Promise((resolve) => {
                const oldAvailables = this.all_players_availables.filter(player => {
                    return player.role.name == 'player';
                });
                oldAvailables.sort(() => Math.random() - 0.5);
                const teamLength = oldAvailables.length / this.possibility.teams;
                allTeams.forEach(
                    team => {
                        var playersForTeam = oldAvailables.slice(0, teamLength);
                        team.push(...playersForTeam);
                        oldAvailables.splice(0, teamLength);
                    }
                );
                resolve(allTeams);
            });
        },
        getSumPlayersPercentage(allTeamsSorted) {
            return new Promise((resolve) => {
                let sum = 0;
                let averages = [];
                this.all_players_availables.forEach(player => {
                    sum += player.level.percentage;
                });

                allTeamsSorted.forEach(team => {
                    let average = 0;
                    team.forEach(player => {
                        average += player.level.percentage;
                    });
                    averages.push(average);
                });

                resolve({
                    allTeamsSorted,
                    sum,
                    averages
                });
            });
        },
        setComplete() {
            return new Promise((resolve) => {
                this.setTeamsByGoalkeepers()
                    .then(allTeams => { return this.setPlayersForTeams(allTeams); })
                    .then(allTeamsSorted => { return this.getSumPlayersPercentage(allTeamsSorted); })
                    .then(results => {
                        const { sum, averages, allTeamsSorted } = results;
                        console.log("🚀 ~ file: TeamsView.vue:94 ~ returnnewPromise ~ averages:", averages);
                        const avgForTeam = Math.round(sum / allTeamsSorted.length);
                        console.log("🚀 ~ file: TeamsView.vue:96 ~ returnnewPromise ~ avgForTeam:", avgForTeam)
                        let areEqual = averages.every(average => {
                            if (average == avgForTeam) {
                                console.log('sono equilibrate');
                                return true;
                            }
                            else if (average > avgForTeam - 1) {
                                console.log('ci sono squadre piu forti delle altre');
                                return true;
                            }
                            return false
                        });
                        this.$store.state.lastResult = areEqual;
                        this.teamsSorted = allTeamsSorted;
                        this.lastAverages = averages;
                        resolve(areEqual);
                    });
            });
        },
        async execute() {
            var areEqual = await this.setComplete();
            console.log("🚀 ~ file: TeamsView.vue:105 ~ execute ~ areEqual:", areEqual);
            while (!areEqual) {
                areEqual = await this.setComplete();
            }
        }
    },
    created() {
        if (this.$store.state.possibility == null || Object.keys(this.all_players_availables).length === 0) {
            this.$router.replace('/choose_players');
        }
        this.$store.state.lastResult = false;
    },
    mounted() {
        this.setComplete();
        if (!this.lastResult) {
            this.execute();
        }
    },
};
</script>