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
         **this function will cut the players array
         */
        setTeams() {
            const teamLength = Math.round(this.all_players_availables.length / this.possibility.teams); // 5
            const sortedPlayers = [...this.sortRandomAllPlayersAvailables()];
            const playersToTeams = [];
            for (let i = 0; i < this.possibility.teams; i++) {
                var allPlayersForTeams = [];
                var playersForTeam = sortedPlayers.splice(0, teamLength);
                allPlayersForTeams.push(...playersForTeam);
                allPlayersForTeams.push(this.all_goal_keepers[i]);
                playersToTeams.push(allPlayersForTeams);
            }
            console.log("🚀 ~ file: TeamsView.vue:45 ~ setTeams ~ playersToTeams:", playersToTeams)
            return playersToTeams;
        },

        /**
         ** the variable justPlayers, meaning all the playes without the goalkeepers.
         * @param {Array} allTeamsByGoalkeepers 
         */
        setPlayersForTeams(allTeamsByGoalkeepers, justPlayers) {
            const teamLength = Math.round(justPlayers.length / this.possibility.teams);
            allTeamsByGoalkeepers.forEach(team => {
                var playersForTeam = [...justPlayers].slice(0, teamLength);
                if (team.length > teamLength) {
                    team = team.slice(0, 1);
                }
                team.push(...playersForTeam);
                justPlayers.splice(0, teamLength);
            });
            return allTeamsByGoalkeepers;
            // var teamsAndOwnAverages = [];
            // allTeamsByGoalkeepers.forEach(team => {
            //     let singleTeamAverage = 0;
            //     team.forEach(player => {
            //         singleTeamAverage += player.level.percentage;
            //     });
            //     teamsAndOwnAverages.push({ team: team, average: singleTeamAverage });
            // });
            // console.log("🚀 ~ file: TeamsView.vue:80 ~ //returnnewPromise ~ teamsAndOwnAverages:", teamsAndOwnAverages)
            // return teamsAndOwnAverages;
            // resolve(teamsAndOwnAverages);
            // });
        },
        sortRandomAllPlayersAvailables() {
            return this.all_players_availables.filter(player => {
                return player.role.name == 'player';
            }).sort(() => Math.random() - 0.5);
        },
        setAll() {
            const teamsByGoalkeepers = this.setTeamsByGoalkeepers();
            var justPlayers = this.$store.getters.randomSortedPlayers;
            var finalTeamsAndAverages = this.setPlayersForTeams(teamsByGoalkeepers, justPlayers);
            const generalAverage = finalTeamsAndAverages.reduce((acc, curr) => { return acc += curr.average; }, 0);
            const idealAverage = Math.round(generalAverage / this.possibility.teams);
            let areEqual = finalTeamsAndAverages.every(c => { return c.average == idealAverage; });
            console.log("🚀 ~ file: TeamsView.vue:95 ~ setAll ~ areEqual:", areEqual);
            if (!areEqual) {
                for (let i = 0; i < 5; i++) {
                    var sortedPlayers = this.sortRandomAllPlayersAvailables();
                    finalTeamsAndAverages = this.setPlayersForTeams(teamsByGoalkeepers, sortedPlayers);
                    console.log("🚀 ~ file: TeamsView.vue:98 ~ setAll ~ finalTeamsAndAverages:", finalTeamsAndAverages);
                }
            }
            // return
        }
    },
    created() {
        if (this.$store.state.possibility == null || Object.keys(this.all_players_availables).length === 0) {
            this.$router.replace('/choose_players');
        }
        this.$store.state.lastResult = false;
        // this.setAll();
        this.setTeams();
    },
};
</script>