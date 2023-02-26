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
            lastResult: null
            // sumAvailablesAndGoalkeepers: this.all_players_availables.length + this.all_goal_keepers.length,
            // numberOfTeams : this.possibility.teams,
            // numberOfPlayersForTeam : this.possibility.players
        };
    },
    computed: {
        ...mapState([
            'all_players_availables',
            'all_goal_keepers',
            'possibility'
        ]),
    },
    methods: {
        setTeamsByGoalkeepers() {
            return new Promise((resolve) => {
                const allTeams = [];
                const all_goal_keepers = this.all_players_availables.filter(player => {
                    return player.role.name == 'goalkeeper';
                });
                all_goal_keepers.forEach(
                    gk => {
                        var team = [];
                        if (!team.includes(gk)) {
                            team.push(gk);
                        }
                        allTeams.push(team);
                    }
                );
                resolve(allTeams);
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
        setFinalTeams() {
            return new Promise((resolve) => {
                this.setTeamsByGoalkeepers().then((allTeams) => {
                    this.setPlayersForTeams(allTeams).then((allTeamsSorted) => {
                        this.getSumPlayersPercentage(allTeamsSorted).then((results) => {
                            const { sum, averages, allTeamsSorted } = results;
                            console.log("🚀 ~ file: TeamsView.vue:92 ~ this.getSumPlayersPercentage ~ averages:", averages);
                            const avgForTeam = Math.round(sum / allTeamsSorted.length);
                            let areEqual = averages.every(average => average == avgForTeam);
                            resolve(areEqual);
                        });
                    });
                });
            });
        }
    },
    created() {
        if (this.$store.state.possibility == null || Object.keys(this.all_players_availables).length === 0) {
            this.$router.replace('/choose_players');
        } else {
            this.setFinalTeams().then((result) => {
                this.lastResult = result;
                if (this.lastResult == false) {
                    console.log("🚀 ~ file: TeamsView.vue:109 ~ this.setFinalTeams ~ this.lastResult:", this.lastResult);
                    let counter = 0;
                    while (this.lastResult == false) {
                        counter++;
                        console.log("🚀 ~ file: TeamsView.vue:113 ~ this.setFinalTeams ~ counter:", counter);
                        this.setFinalTeams().then((result) => {
                            if (result == true) {
                                this.lastResult = result;
                                console.log("🚀 ~ file: TeamsView.vue:117 ~ this.setFinalTeams ~ this.lastResult:", this.lastResult);
                                return;
                            }
                        });
                    }
                }
            });
            console.log("🚀 ~ file: TeamsView.vue:117 ~ this.setFinalTeams ~ result:", this.lastResult);

        }
    },
};
</script>

<style></style>