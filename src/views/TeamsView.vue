<template>
    <div class="teams-view">
        <div class="view-topbar">
            <h2 class="section-title">{{ $t('teams.teams') }}</h2>
            <div class="topbar-actions">
                <button class="btn-regen" @click="controlBalancedTeams">
                    <i class="fa-solid fa-repeat"></i>
                    {{ $t('buttons.regenerate') }}
                </button>
                <button class="btn-download" @click="downloadImage">
                    <i class="fa-solid fa-download"></i>
                    Scarica
                </button>
            </div>
        </div>

        <div class="teams-list" ref="teamsRef">
            <div v-for="(teamObject, i) in finalTeams" :key="i" class="team-card">
                <div class="team-card-header">
                    <span class="team-label">{{ $t('teams.team') }} {{ i + 1 }}</span>
                    <span class="team-avg">Ø {{ teamObject.average }}</span>
                </div>
                <draggable
                    v-model="teamObject.team"
                    item-key="id"
                    handle=".drag-handle"
                    class="team-players"
                    ghost-class="drag-ghost"
                    chosen-class="drag-chosen"
                >
                    <template #item="{ element: player, index: j }">
                        <div class="team-player-row">
                            <span class="drag-handle"><i class="fa-solid fa-grip-lines"></i></span>
                            <span class="player-num">{{ j + 1 }}</span>
                            <span
                                class="role-tag"
                                :class="[roleTagClass(player), { interactive: !isGoalKeeper(player) }]"
                                @click="cycleRole(player)"
                            >
                                {{ ROLE_ABBR[getVisualRole(player)] || 'PL' }}
                            </span>
                            <span class="player-name-full">{{ player.nick_name }}</span>
                            <span class="level-pill" :class="`lv-${getLevelClass(player.level.name)}`">
                                {{ player.level.percentage }}
                            </span>
                        </div>
                    </template>
                </draggable>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import { useStore } from "vuex"
import { useRouter } from "vue-router"
import draggable from 'vuedraggable'
import html2canvas from 'html2canvas'

const store = useStore()
const router = useRouter()

const all_players_availables = computed(() => store.state.all_players_availables)
const all_goal_keepers = computed(() => store.state.all_goal_keepers)
const possibility = computed(() => store.state.possibility)
const finalTeams = ref([])
const teamsRef = ref(null)

const getLevelClass = (name) => {
    const map = { basso: 1, 'medio-basso': 2, medio: 3, 'medio-alto': 4, alto: 5 }
    return map[name] || 3
}

const ROLE_ABBR = { goalkeeper: 'PT', player: 'PL', difensore: 'DEF', centrocampo: 'CEN', attaccante: 'ATT' }
const ROLE_ORDER = { goalkeeper: 0, difensore: 1, centrocampo: 2, attaccante: 3 }

const isGoalKeeper = (player) => player.role?.name === 'goalkeeper' || player.goalkeeper_provisory

const getVisualRole = (player) => {
    if (isGoalKeeper(player)) return 'goalkeeper'
    if (player.temporaryRole) return player.temporaryRole
    const firstTactical = player.roles && player.roles[0]
    return firstTactical ? firstTactical.name : 'difensore'
}

const roleTagClass = (player) => {
    const role = getVisualRole(player)
    if (role === 'goalkeeper') return 'gk'
    const map = { difensore: 'def', centrocampo: 'mid', attaccante: 'att' }
    return map[role] || 'pl'
}

const cycleRole = (player) => {
    if (isGoalKeeper(player)) return
    const current = getVisualRole(player)
    const order = ['difensore', 'centrocampo', 'attaccante']
    let nextIdx = (order.indexOf(current) + 1) % order.length
    if (nextIdx === -1 || Number.isNaN(nextIdx)) nextIdx = 0
    player.temporaryRole = order[nextIdx]
}

const sortByRole = (team) => [...team].sort((a, b) => {
    const aRole = isGoalKeeper(a) ? 'goalkeeper' : (a.temporaryRole || a.roles?.[0]?.name || 'difensore')
    const bRole = isGoalKeeper(b) ? 'goalkeeper' : (b.temporaryRole || b.roles?.[0]?.name || 'difensore')
    return (ROLE_ORDER[aRole] ?? 1) - (ROLE_ORDER[bRole] ?? 1)
})

const downloadImage = async () => {
    if (!teamsRef.value) return
    const canvas = await html2canvas(teamsRef.value, { backgroundColor: '#0f1117', scale: 2 })
    const link = document.createElement('a')
    link.download = 'squadre.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]
    }
    return array
}

function buildInterleavedPlayers(fieldPlayers) {
    const buckets = { difensore: [], centrocampo: [], attaccante: [], unassigned: [] }
    for (const p of fieldPlayers) {
        const key = p.roles && p.roles[0] && buckets[p.roles[0].name] ? p.roles[0].name : 'unassigned'
        buckets[key].push(p)
    }
    Object.values(buckets).forEach(b => shuffleArray(b))
    const active = Object.values(buckets).filter(b => b.length > 0)
    const interleaved = []
    while (active.some(b => b.length > 0)) {
        for (const b of active) {
            if (b.length > 0) interleaved.push(b.shift())
        }
    }
    return interleaved
}

function generateBalancedTeamsAttempt() {
    if (!possibility.value) return []
    const fieldPlayers = all_players_availables.value.filter(p => p.role.name !== 'goalkeeper')
    let players = buildInterleavedPlayers(fieldPlayers)
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
    finalTeams.value = best.map(t => ({ ...t, team: sortByRole(t.team) }))
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

.topbar-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
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

.btn-download {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: var(--bg-elevated);
    border: 1px solid var(--border-md);
    color: var(--t2);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 600;
    padding: 0.5rem 0.9rem;
    border-radius: var(--r-pill);
    cursor: pointer;
    transition: background var(--t-fast), border-color var(--t-fast);

    &:hover {
        background: var(--bg-hover);
        border-color: var(--t2);
    }

    i { font-size: 0.75rem; }
}

.teams-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.team-players {
    /* keep existing layout intact when used as draggable container */
}

.team-player-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.45rem 0.75rem;
    border-radius: var(--r-sm, 6px);
    transition: background var(--t-fast);

    &:hover {
        background: var(--bg-hover);
    }
}

.drag-handle {
    color: var(--t3, #555);
    cursor: grab;
    padding: 0 0.2rem;
    font-size: 0.72rem;
    flex-shrink: 0;

    &:active { cursor: grabbing; }
}

.drag-ghost {
    opacity: 0.35;
}

.drag-chosen {
    background: var(--bg-hover) !important;
}

/* Level-colored level-pill variants in team rows */
.level-pill {
    &.lv-1 { color: var(--lv1); border-color: rgba(239,68,68,0.3); }
    &.lv-2 { color: var(--lv2); border-color: rgba(249,115,22,0.3); }
    &.lv-3 { color: var(--lv3); border-color: rgba(234,179,8,0.3); }
    &.lv-4 { color: var(--lv4); border-color: rgba(34,197,94,0.3); }
    &.lv-5 { color: var(--lv5); border-color: rgba(129,140,248,0.3); }
}

.role-tag.interactive {
    cursor: pointer;
    user-select: none;
    transition: opacity var(--t-fast), transform var(--t-fast);

    &:hover { opacity: 0.8; }
    &:active { transform: scale(0.95); }
}
</style>
