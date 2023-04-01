<template>
    <div>
        TeamsView
        <span @click="setAgain">click</span>
    </div>
</template>

<script>
import { mapState } from "vuex";
// import { mapMutations } from "vuex";
// import { mapActions } from 'vuex';

export default {
    name: 'TeamsView',
    data() {
        return {
            allTeamsByGoalkeepersData: null,
        };
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
         * !FIRST
         ** This function returns an array of n arrays, just with the goalkeeper for every single team.
         ** Example: 2 teams, [[gk1],[gk2]]
         * @return {Array} - array of arrays
         */
        setTeamsByGoalkeepers() {
            // return new Promise((resolve) => {
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
            return teamsByGoalkeepers;
            // resolve(teamsByGoalkeepers);
            // });
        },
        /**
         ** the variable justPlayers, meaning all the playes without the goalkeepers.
         * @param {Array} allTeamsByGoalkeepers 
         */
        setPlayersForTeams(allTeamsByGoalkeepers, justPlayers) {
            // return new Promise((resolve) => {
            const teamLength = Math.round(justPlayers.length / this.possibility.teams);
            allTeamsByGoalkeepers.forEach(team => {
                var playersForTeam = justPlayers.slice(0, teamLength);
                if (team.length > teamLength) {
                    team = team.slice(0, 1);
                }
                team.push(...playersForTeam);
                justPlayers.splice(0, teamLength);
            });
            var teamsAndOwnAverages = [];
            allTeamsByGoalkeepers.forEach(team => {
                let singleTeamAverage = 0;
                team.forEach(player => {
                    singleTeamAverage += player.level.percentage;
                });
                teamsAndOwnAverages.push({ team: team, average: singleTeamAverage });
            });
            return teamsAndOwnAverages;
            // resolve(teamsAndOwnAverages);
            // });
        },
        sortRandomAllPlayersAvailables() {
            return this.all_players_availables.filter(player => {
                return player.role.name == 'player';
            }).sort(() => Math.random() - 0.5);
        },
        /**
         *TODO check if this.all_players_availables from store can be sorted when comes to component.
         */
        setAll() {
            const teamsByGoalkeepers = this.setTeamsByGoalkeepers();
            var justPlayers = this.sortRandomAllPlayersAvailables();
            var finalTeamsAndAverages = this.setPlayersForTeams(teamsByGoalkeepers, justPlayers);
            const generalAverage = finalTeamsAndAverages.reduce((acc, curr) => { return acc += curr.average; }, 0);
            const idealAverage = Math.round(generalAverage / this.possibility.teams);
            let areEqual = finalTeamsAndAverages.every(c => { return c.average == idealAverage; });
            if (!areEqual) {
                // make a while when the averages are not the same.
            }
        }
    },
    created() {
        if (this.$store.state.possibility == null || Object.keys(this.all_players_availables).length === 0) {
            this.$router.replace('/choose_players');
        }
        this.$store.state.lastResult = false;
        this.setAll();
    },
};
</script>