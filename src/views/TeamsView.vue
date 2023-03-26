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
            teamsByGoalkeepers: [],
            teamsSorted: [],
            lastAverages: [],
            teamsAreEqual: false,
            counter: 0,
            teamsAndAverages: [],
            areEqual: false
        };
    },
    computed: {
        ...mapState([
            'all_players_availables',
            'all_goal_keepers',
            'possibility',
            'lastResult',
            // 'teamsAndAverages',
        ]),
    },
    methods: {
        /**
         * !FIRST
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
                this.teamsByGoalkeepers = teamsByGoalkeepers;
                resolve(teamsByGoalkeepers);
            });
        },
        /**
         ** the variable justPlayers, meaning all the playes without the goalkeepers.
         * @param {Array} allTeamsByGoalkeepers 
         */
        setPlayersForTeams(allTeamsByGoalkeepers) {
            // return new Promise((resolve) => {
            const justPlayers = this.all_players_availables.filter(player => {
                return player.role.name == 'player';
            });
            const shuffledPlayers = this.randomizeAllPlayersAvailables(justPlayers);
            const teamLength = Math.round(justPlayers.length / this.possibility.teams);

            allTeamsByGoalkeepers.forEach(team => {
                var playersForTeam = shuffledPlayers.slice(0, teamLength);
                team.push(...playersForTeam);
                shuffledPlayers.splice(0, teamLength);
            });
            this.teamsAndAverages = [];
            allTeamsByGoalkeepers.forEach(team => {
                let singleTeamAverage = 0;
                team.forEach(player => {
                    singleTeamAverage += player.level.percentage;
                });
                this.teamsAndAverages.push({ team: team, average: singleTeamAverage });
            });

            const generalAverage = this.teamsAndAverages.reduce((acc, curr) => { return acc += curr.average; }, 0);
            const idealAverage = Math.round(generalAverage / this.possibility.teams);
            return this.areEqual = this.teamsAndAverages.every(c => c.average == idealAverage);
            // resolve(this.areEqual);
            // });
        },
        repeatSetPlayers() {
            let result = this.setPlayersForTeams(this.teamsByGoalkeepers);
            console.log("🚀 ~ file: TeamsView.vue:89 ~ repeatSetPlayers ~ result:", result);
            // while (!result) {
            // for (let i = 0; i < 50; i++) {
            //     result = this.setPlayersForTeams(this.teamsByGoalkeepers);
            // }
            // return result

        },
        /**
         * !TO FIX
         */
        recursiveFunction() {
            // let result = this.repeatSetPlayers();
            // if (!result) {
            //     this.recursiveFunction();
            // } else {
            //     // do something else after the function returns true
            //     console.log('aaaaa');
            //     return;
            // }
        },
        randomizeAllPlayersAvailables(array) {
            return array.sort(() => Math.random() - 0.5);
        },
        /**
         * !Not in use yet
         * @param {Array} allTeamsSorted 
         */
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
            this.setTeamsByGoalkeepers()
                .then(allTeamsByGoalkeepers => { return this.setPlayersForTeams(allTeamsByGoalkeepers); })
                .then(areEqual => {
                    if (!areEqual) {
                        this.recursiveFunction();
                    }
                });
            // .then(areEqual => {
            //     console.log("🚀 ~ file: TeamsView.vue:128 ~ //returnnewPromise ~ areEqual:", areEqual);
            //     return;
            // });
            // .then(allTeamsSorted => {
            //     console.log("🚀 ~ file: TeamsView.vue:103 ~ returnnewPromise ~ allTeamsSorted:", allTeamsSorted);
            // return this.getSumPlayersPercentage(allTeamsSorted); 
            // });
            // .then(results => {
            //     const { sum, averages, allTeamsSorted } = results;
            //     console.log("🚀 ~ file: TeamsView.vue:94 ~ returnnewPromise ~ averages:", averages);
            //     const avgForTeam = Math.round(sum / allTeamsSorted.length);
            //     console.log("🚀 ~ file: TeamsView.vue:96 ~ returnnewPromise ~ avgForTeam:", avgForTeam);
            //     let areEqual = averages.every(average => {
            //         if (average == avgForTeam) {
            //             console.log('sono equilibrate');
            //             return true;
            //         }
            //         else if (average > avgForTeam - 1) {
            //             console.log('ci sono squadre piu forti delle altre');
            //             return true;
            //         }
            //         return false;
            //     });
            //     this.$store.state.lastResult = areEqual;
            //     this.teamsSorted = allTeamsSorted;
            //     this.lastAverages = averages;
            //     resolve(areEqual);
            // });
            // });
        }
    },
    created() {
        if (this.$store.state.possibility == null || Object.keys(this.all_players_availables).length === 0) {
            this.$router.replace('/choose_players');
        }
        this.$store.state.lastResult = false;
        this.setComplete();
    },
};
</script>