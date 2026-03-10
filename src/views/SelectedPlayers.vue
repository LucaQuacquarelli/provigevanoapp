<template>
    <div class="selected-view">
        <div class="view-topbar">
            <div>
                <h2 class="section-title">{{ $t('players.availables') }}</h2>
                <span class="player-count">{{ counterPlayersAvailables }} giocatori</span>
            </div>
            <router-link to="/teams" class="btn-cta sort-btn">
                <i class="fa-solid fa-shuffle"></i>
                Crea Squadre
            </router-link>
        </div>

        <div class="players-grid">
            <div
                v-for="player in this.$store.state.all_players_availables"
                :key="player.id"
                class="player-grid-item"
            >
                <PlayerCard :player="player" />
            </div>
        </div>
    </div>
</template>

<script>
import PlayerCard from '../components/PlayerCard.vue'
export default {
    name: "SelectedPlayers",
    components: { PlayerCard },
    computed: {
        counterPlayersAvailables() {
            return this.$store.state.all_players_availables.length
        }
    },
    created() {
        if (Object.keys(this.$store.state.all_players_availables).length === 0 && this.$store.state.all_goal_keepers.length == 0) {
            this.$router.replace("/choose_players")
        }
    }
}
</script>

<style lang="scss" scoped>
.selected-view {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.view-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}

.player-count {
    font-size: 0.85rem;
    color: var(--t2);
    margin-top: 0.15rem;
    display: block;
}

.sort-btn {
    flex-shrink: 0;
    font-size: 0.95rem;
    padding: 0.7rem 1.25rem;
}

.players-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
}

.player-grid-item {
    min-height: 160px;
}
</style>
