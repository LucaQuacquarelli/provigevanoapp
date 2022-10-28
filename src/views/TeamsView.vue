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
                this.all_players_availables.forEach(player => {
                    //1
                    // const pushplayersNTimes = this.possibility.playersForTeam - team.length 
                    // for (let i = 0; i < pushplayersNTimes; i++) {
                    //     team.push(player)
                    // }

                    //2
                    // if (team.length < this.possibility.playersForTeam) {
                        //     team.push(player)
                    // }

                    //3
                    if (team.length <= this.possibility.playersForTeam-1 ){
                        team.push(player)
                    }
                });
                console.log("🚀 ~ file: TeamsView.vue ~ line 49 ~ setPlayersForTeams ~ team", team)
            });
        }
    },
    created() {
        if (this.$store.state.possibility == null) {
            this.$router.replace('/selected_players')
        } else {
            this.setTeamsByGoalkeepers()
                .then((allTeams) => {
                    this.setPlayersForTeams(allTeams)
                }
                )
        }
    },
}
</script>

<style>

</style>