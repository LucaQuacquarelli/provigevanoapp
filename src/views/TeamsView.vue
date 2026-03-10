<template>
    <div class="teams-view">
        <div class="view-topbar">
            <h2 class="section-title">{{ $t('teams.teams') }}</h2>
            <button class="btn-regen" @click="controlBalancedTeams">
                <i class="fa-solid fa-repeat"></i>
                {{ $t('buttons.regenerate') }}
            </button>
        </div>

        <div class="teams-list">
            <div v-for="(teamObject, i) in finalTeams" :key="i" class="team-card">
                <div class="team-card-header">
                    <span class="team-label">{{ $t('teams.team') }} {{ i + 1 }}</span>
                    <span class="team-avg">Ø {{ teamObject.average }}</span>
                </div>
                <div class="team-players">
                    <div
                        v-for="(player, j) in orderByLevel(teamObject.team)"
                        :key="j"
                        class="team-player-row"
                    >
                        <span class="player-num">{{ j + 1 }}</span>
                        <span class="role-tag" :class="player.role.name === 'goalkeeper' ? 'gk' : 'pl'">
                            {{ roleAbbreviation(player.role.name) }}
                        </span>
                        <span class="player-name-full">{{ player.nick_name }}</span>
                        <span class="level-pill" :class="`lv-${getLevelClass(player.level.name)}`">
                            {{ player.level.percentage }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import { useStore } from "vuex"
import { useRouter } from "vue-router"

const store = useStore()
const router = useRouter()

const all_players_availables = computed(() => store.state.all_players_availables)
const all_goal_keepers = computed(() => store.state.all_goal_keepers)
const possibility = computed(() => store.state.possibility)
const finalTeams = ref([])

const getLevelClass = (name) => {
    const map = { basso: 1, 'medio-basso': 2, medio: 3, 'medio-alto': 4, alto: 5 }
    return map[name] || 3
}

const orderByLevel = (team) => [...team].sort((a, b) => a.level.percentage - b.level.percentage)

const roleAbbreviation = (role) => ({ goalkeeper: 'PT', player: 'PL' }[role])

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]
    }
    return array
}

function generateBalancedTeamsAttempt() {
    if (!possibility.value) return []
    let players = shuffleArray([...all_players_availables.value.filter(p => p.role.name === 'player')])
    const teams = []
    const playersPerTeam = possibility.value.playersForTeam

    for (let i = 0; i < possibility.value.teams; i++) {
        const teamRoster = []
        let score = 0
        if (all_goal_keepers.value[i]) {
            teamRoster.push(all_goal_keepers.value[i])
            score += all_goal_keepers.value[i].level.percentage
        }
        teams.push({ team: teamRoster, average: score })
    }

    for (const player of players) {
        const eligible = teams.filter(t => t.team.length < playersPerTeam)
        if (!eligible.length) break
        eligible.sort((a, b) => a.average - b.average)
        eligible[0].team.push(player)
        eligible[0].average += player.level.percentage
    }

    return teams
}

function controlBalancedTeams() {
    let best = []
    let bestDiff = Infinity
    for (let i = 0; i < 50; i++) {
        const candidate = generateBalancedTeamsAttempt()
        if (!candidate?.length) continue
        const scores = candidate.map(t => t.average)
        const diff = Math.max(...scores) - Math.min(...scores)
        if (diff < bestDiff) { bestDiff = diff; best = candidate }
        if (diff <= 1) break
    }
    finalTeams.value = best
}

onMounted(() => {
    if (!possibility.value || !all_players_availables.value?.length) {
        router.replace('/choose_players')
        return
    }
    controlBalancedTeams()
})
</script>

<style lang="scss" scoped>
.teams-view {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.view-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.btn-regen {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: var(--bg-elevated);
    border: 1px solid var(--border-md);
    color: var(--green);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 600;
    padding: 0.5rem 0.9rem;
    border-radius: var(--r-pill);
    cursor: pointer;
    transition: background var(--t-fast), border-color var(--t-fast);

    &:hover {
        background: var(--bg-hover);
        border-color: var(--green);
    }

    i { font-size: 0.75rem; }
}

.teams-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

/* Level-colored level-pill variants in team rows */
.level-pill {
    &.lv-1 { color: var(--lv1); border-color: rgba(239,68,68,0.3); }
    &.lv-2 { color: var(--lv2); border-color: rgba(249,115,22,0.3); }
    &.lv-3 { color: var(--lv3); border-color: rgba(234,179,8,0.3); }
    &.lv-4 { color: var(--lv4); border-color: rgba(34,197,94,0.3); }
    &.lv-5 { color: var(--lv5); border-color: rgba(129,140,248,0.3); }
}
</style>
