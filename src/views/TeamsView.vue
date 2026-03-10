<template>
    <div class="container-fluid">
        <h1 class="d-flex justify-content-between align-items-center">
            {{ $t('teams.teams') }}
            <span class="btn btn-success" @click="controlBalancedTeams">
                <i class="fa-solid fa-repeat fa-xs"></i>
                &nbsp;{{ $t('buttons.regenerate') }}
            </span>
        </h1>
        <div class="row">
            <div v-for="(teamObject, i) in finalTeams" :key="i" class="py-3">
                <div class="d-flex justify-content-between mb-2">
                    <h6>{{ $t('teams.team') }} {{ i + 1 }}</h6>
                    <span class="badge text-bg-primary">
                        {{ $t('teams.media') }}:&nbsp; {{ teamObject.average }}
                    </span>
                </div>
                <table class="table">
                    <thead class="table-light">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">{{ $t('form.name') }}</th>
                            <th scope="col">{{ $t('form.role') }}</th>
                            <th scope="col">{{ $t('form.nick_name') }}</th>
                            <th scope="col">{{ $t('form.level') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(player, j) in orderByLevel(teamObject.team)" :key="j">
                            <th scope="row">{{ j + 1 }}</th>
                            <td>{{ player.name }}</td>
                            <td>
                                <span class="badge" :class="player.role.name == 'goalkeeper' ? 'bg-dark' : 'bg-info'">
                                    {{ roleAbbreviation(player.role.name) }}
                                </span>
                            </td>
                            <td>{{ player.nick_name }}</td>
                            <td>
                                <span class="badge" :class="badgeByLevel(player.level.name)">
                                    {{ player.level.name }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
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

// Reactive state for the teams to be displayed
const finalTeams = ref([])
// let teamsAndOwnAverages = []

const badgeByLevel = (level) => {
    const badgeClass = {
        'basso': "bg-success",
        'medio-basso': "bg-success",
        'medio': "bg-warning",
        'medio-alto': "bg-warning",
        'alto': "bg-danger",
    }
    return badgeClass[level]
}

const orderByLevel = (team) => {
    // Clone array to avoid mutating the original reference if needed, and sort
    return [...team].sort((a, b) => a.level.percentage - b.level.percentage)
}

const roleAbbreviation = (role) => {
    const abbreviation = {
        'goalkeeper': "PT",
        'player': "PL",
    }
    return abbreviation[role]
}

// Helper for proper shuffling (Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generateBalancedTeamsAttempt() {
    if (!possibility.value) return []

    // 1. Prepare Players
    // Filter field players
    let players = all_players_availables.value
        .filter(player => player.role.name == 'player')
    
    // Shuffle them to ensure variety in every attempt
    // We clone the array to avoid mutating the original store data
    players = shuffleArray([...players])

    // 2. Initialize Teams structure
    const teams = []
    const playersPerTeam = possibility.value.playersForTeam

    for (let i = 0; i < possibility.value.teams; i++) {
        const teamRoster = []
        let currentScore = 0

        // Assign Goalkeeper if available for this team index
        if (all_goal_keepers.value[i]) {
            teamRoster.push(all_goal_keepers.value[i])
            currentScore += all_goal_keepers.value[i].level.percentage
        }

        teams.push({
            team: teamRoster,
            average: currentScore // This tracks the Sum of levels
        })
    }

    // 3. Greedy Distribution
    // Assign each player to the team with the LOWEST current score that isn't full.
    // This helps balance the teams dynamically as we fill them.
    for (const player of players) {
        // Find teams that are not full
        const eligibleTeams = teams.filter(t => t.team.length < playersPerTeam)
        
        if (eligibleTeams.length === 0) break // All teams full

        // Sort eligible teams by current score (Ascending) -> Weakest first
        eligibleTeams.sort((a,b) => a.average - b.average)
        
        // Pick the weakest
        const targetTeam = eligibleTeams[0]
        
        targetTeam.team.push(player)
        targetTeam.average += player.level.percentage
    }
    
    return teams
}

function controlBalancedTeams() {
    let bestConfiguration = []
    let bestDiff = Infinity
    
    // Attempt to generate teams multiple times and pick the most balanced result.
    // Since we use a greedy distribution on shuffled input, we get good "Local Optima".
    // Picking the best of 50 attempts usually yields the Global Optimum or very close to it.
    const iterations = 50
    
    for (let i = 0; i < iterations; i++) {
        const candidateTeams = generateBalancedTeamsAttempt()
        
        if (!candidateTeams || candidateTeams.length === 0) continue

        const scores = candidateTeams.map(t => t.average)
        const maxScore = Math.max(...scores)
        const minScore = Math.min(...scores)
        const diff = maxScore - minScore
        
        // Update best found so far
        if (diff < bestDiff) {
            bestDiff = diff
            bestConfiguration = candidateTeams
        }
        
        // Optimization: If the difference is 0 or 1, it's as balanced as mathematically possible.
        // Stop early to save resources and avoid unnecessary loops.
        if (diff <= 1) {
            break
        }
    }
    
    console.log(`Generated teams with Max Difference: ${bestDiff}`)
    
    finalTeams.value = bestConfiguration
}

onMounted(() => {
    if (possibility.value == null || !all_players_availables.value || Object.keys(all_players_availables.value).length === 0) {
        router.replace('/choose_players')
        return
    }
    controlBalancedTeams()
})
</script>