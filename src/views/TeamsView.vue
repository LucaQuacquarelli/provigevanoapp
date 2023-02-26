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
                // console.log("🚀 ~ file: TeamsView.vue:45 ~ returnnewPromise ~ allTeams:", allTeams);
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
        setComplete() {
            return new Promise((resolve) => {
                this.setTeamsByGoalkeepers()
                    .then(allTeams => { return this.setPlayersForTeams(allTeams); })
                    .then(allTeamsSorted => { return this.getSumPlayersPercentage(allTeamsSorted); })
                    .then(results => {
                        const { sum, averages, allTeamsSorted } = results;
                        const avgForTeam = Math.round(sum / allTeamsSorted.length);
                        let areEqual = averages.every(average => average == avgForTeam);
                        this.$store.state.lastResult = areEqual;
                        this.teamsSorted = allTeamsSorted;
                        this.lastAverages = averages;
                        resolve(areEqual);
                    });
            });
        },
        async execute() {
            var areEqual = await this.setComplete();
            while (!areEqual) {
                areEqual = await this.setComplete();
                console.log("🚀 ~ file: TeamsView.vue:106 ~ execute ~ areEqual:", areEqual)
            }
            console.log('all done');
            console.log("🚀 ~ file: TeamsView.vue:110 ~ execute ~ this.teamsSorted:", this.teamsSorted)
            console.log("🚀 ~ file: TeamsView.vue:111 ~ execute ~ this.lastAverages:", this.lastAverages)
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

<style></style>