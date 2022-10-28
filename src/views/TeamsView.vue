<template>
    <div>
        TeamsView
    </div>
</template>

<script>
    import { mapState } from "vuex";
export default {
    name: 'TeamsView',
    data() {
        return {
            // sumAvailablesAndGoalkeepers: this.all_players_availables.length + this.all_goal_keepers.length,
            // numberOfTeams : this.possibility.teams,
            // numberOfPlayersForTeam : this.possibility.players
        }
    },
    computed:{
        ...mapState([
            'all_players_availables',
            'all_goal_keepers',
            'possibility'
        ]),
    },
    methods: {
        setTeamsByGoalkeepers() {
            /**
             * !Somma due array -> tutti i disponibili insiem ai portieri
             ** Creerà n squadre (array) in base ai goalkeepers e alla length di possibility.players
             ** Ottenere la media dei players.level per ogni squadra generata
             * ? if ( media  )
             */
            return new Promise((resolve) => {
                const allTeams = []
                this.all_goal_keepers.forEach(gk => {
                    var team = []
                    if (!team.includes(gk)) {
                        team.push(gk)
                    }
                    allTeams.push(team)
                });
                resolve(allTeams);
            })
        },
        setPlayersForTeams(allTeams){
            allTeams.forEach(team => {
                // this.all_players_availables.forEach(player => {
                //     if (team.length-1 <= this.possibility.playersForTeam ){
                //         team.push(player)
                //     }
                // });
                console.log("🚀 ~ file: TeamsView.vue ~ line 52 ~ setPlayersForTeams ~ this.all_players_availables", this.all_players_availables.length)
                console.log("🚀 ~ file: TeamsView.vue ~ line 49 ~ setPlayersForTeams ~ this.possibility.playersForTeam", this.possibility.playersForTeam)
                console.log(team.length);
            });
            console.log("🚀 ~ file: TeamsView.vue ~ line 46 ~ setPlayersForTeams ~ allTeams", allTeams)
        }
    },
    created() {
        if (this.$store.state.possibility == null) {
            this.$router.replace('/selected_players')
        } else {
            this.setTeamsByGoalkeepers()
                .then((allTeams) => {
                    console.log("🚀 ~ file: TeamsView.vue ~ line 65 ~ .then ~ allTeams", allTeams)
                    // this.setPlayersForTeams(allTeams)
                }
                )
        }
    },
}
</script>

<style>

</style>