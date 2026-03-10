<template>
    <div class="choose-view">
        <div class="view-header">
            <h2 class="section-title">{{ $t('players.select_players') }}</h2>
        </div>

        <div class="search-row">
            <Search :playersFiltered="true" />
        </div>

        <!-- Textarea nascosta -->
        <textarea name="players_list" id="players_list" v-model="players_list" class="d-none"></textarea>

        <!-- Accordion disponibili -->
        <div class="accordion mb-3" id="accordionPlayers">
            <div class="accordion-item">
                <h2 class="accordion-header" id="AvailablesPlayers">
                    <button class="accordion-button" type="button"
                        data-bs-toggle="collapse" data-bs-target="#availables"
                        aria-expanded="true" aria-controls="availables">
                        {{ $t('players.availables') }}
                        <span class="count-badge green">{{ all_players_availables.length }}</span>
                    </button>
                </h2>
                <div id="availables" class="accordion-collapse collapse" aria-labelledby="AvailablesPlayers"
                    data-bs-parent="#accordionPlayers">
                    <div class="accordion-body">
                        <template v-for="player in all_players_availables" :key="player.id">
                        <label
                            v-if="player.available"
                            class="player-row available"
                            :for="player.id"
                        >
                            <input class="d-none" type="checkbox" :id="player.id"
                                v-model="player.available" @change="setAvailability(player)" />
                            <span class="player-name">{{ player.nick_name }}</span>
                            <span class="player-badges">
                                <span class="level-pill">{{ player.level.percentage }}</span>
                                <span class="role-tag" :class="player.role.name === 'goalkeeper' ? 'gk' : 'pl'">
                                    {{ roleAbbreviation(player.role.name) }}
                                </span>
                            </span>
                        </label>
                        </template>
                    </div>
                </div>
            </div>

            <!-- Accordion non disponibili -->
            <div class="accordion-item">
                <h2 class="accordion-header" id="UnavailablesPlayers">
                    <button class="accordion-button" type="button"
                        data-bs-toggle="collapse" data-bs-target="#unavailables"
                        aria-expanded="true" aria-controls="unavailables">
                        {{ $t('players.not_availables') }}
                        <span class="count-badge">{{ all_players_unavailables.length }}</span>
                    </button>
                </h2>
                <div id="unavailables" class="accordion-collapse collapse" aria-labelledby="UnavailablesPlayers"
                    data-bs-parent="#accordionPlayers">
                    <div class="accordion-body">
                        <label
                            v-for="player in all_players_unavailables"
                            :key="player.id"
                            class="player-row unavailable"
                            :for="player.id"
                        >
                            <input class="d-none" type="checkbox" :id="player.id"
                                v-model="player.available" @change="setAvailability(player)" />
                            <span class="player-name">{{ player.nick_name }}</span>
                            <span class="player-badges">
                                <span class="level-pill">{{ player.level.percentage }}</span>
                                <span class="role-tag" :class="player.role.name === 'goalkeeper' ? 'gk' : 'pl'">
                                    {{ roleAbbreviation(player.role.name) }}
                                </span>
                            </span>
                        </label>
                    </div>
                </div>
            </div>
        </div>

        <!-- Nessun giocatore -->
        <div class="empty-state" v-if="playerNotFound">
            <i class="fa-solid fa-magnifying-glass"></i>
            <span>{{ $t('players.no_players') }}</span>
        </div>

        <!-- Bottone conferma -->
        <div class="confirm-wrap" v-if="showConfirmButton">
            <button class="btn-cta confirm-btn" @click="possibilityModalChange">
                <i class="fa-solid fa-check"></i>
                {{ $t('general.confirm') }}
            </button>
        </div>

        <!-- Modal impostazioni squadre -->
        <transition name="fade-modal">
            <modal-slide v-if="possibilityModal">
                <template v-slot:header>
                    <div class="sheet-header">
                        <button class="sheet-action cancel" @click="clearGoalKeepersProvisory">
                            {{ $t('general.cancel') }}
                        </button>
                        <span class="sheet-title">{{ $t('modal.teamsSettings.sort') }}</span>
                        <button
                            :disabled="modalContent != null"
                            @click="router.replace('/selected_players')"
                            class="sheet-action"
                            :class="modalContent != null ? 'dimmed' : 'confirm'"
                        >
                            {{ $t('general.end') }}
                        </button>
                    </div>
                </template>
                <template v-slot:body>
                    <div class="sheet-body">
                        <!-- Scelta configurazione -->
                        <div v-if="modalContent == false" class="possibilities-grid">
                            <button
                                v-for="(possibility, index) in store.state.allPossibilities"
                                :key="index"
                                class="possibility-btn"
                                @click="checkOnPossibility(possibility)"
                            >
                                <span class="poss-teams">{{ possibility.teams }}</span>
                                <span class="poss-label">{{ $t('teams.teams') }}</span>
                                <span class="poss-sep">·</span>
                                <span class="poss-players">{{ possibility.playersForTeam }}</span>
                                <span class="poss-label">{{ $t('teams.players') }}</span>
                            </button>
                        </div>

                        <!-- Selezione portieri -->
                        <div v-else-if="modalContent == true">
                            <div class="gk-instruction">
                                <span class="gk-instruction-text">
                                    {{ chooseContentModalPossibility(choicePossibility) }}
                                    <strong>{{ differenceGk }}</strong>
                                    {{ differenceGk == 1 ? $t('modal.teamsSettings.gk') : $t('modal.teamsSettings.gks') }}
                                    {{ $t('modal.teamsSettings.toContinue') }}
                                </span>
                            </div>
                            <div class="sheet-search">
                                <Search :playersFiltered="true" />
                            </div>
                            <div v-if="store.state.all_players_availables.length != 0" class="gk-list">
                                <template v-if="choicePossibility == 'add'">
                                    <template v-for="player in store.state.all_players_availables" :key="player.id">
                                    <label
                                        v-if="player.role.id == 1"
                                        class="player-row available"
                                    >
                                        <input class="d-none" type="checkbox" v-model="player.available"
                                            @change="setGoalKeepersProvisory(player)" />
                                        <span class="player-name">{{ player.nick_name }}</span>
                                        <span class="player-badges">
                                            <span class="level-pill">{{ player.level.percentage }}</span>
                                            <span class="role-tag pl">PL</span>
                                        </span>
                                    </label>
                                    </template>
                                </template>
                                <template v-else>
                                    <template v-for="player in store.state.all_players_availables" :key="player.id">
                                    <label
                                        v-if="player.role.id == 2"
                                        class="player-row available"
                                    >
                                        <input class="d-none" type="checkbox" v-model="player.available"
                                            @change="setGoalKeepersProvisory(player)" />
                                        <span class="player-name">{{ player.nick_name }}</span>
                                        <span class="player-badges">
                                            <span class="level-pill">{{ player.level.percentage }}</span>
                                            <span class="role-tag gk">PT</span>
                                        </span>
                                    </label>
                                    </template>
                                </template>
                            </div>
                            <div class="empty-state" v-if="store.state.all_players_availables.length == 0">
                                <i class="fa-solid fa-magnifying-glass"></i>
                                <span>{{ $t('players.no_players') }}</span>
                            </div>
                        </div>

                        <!-- Conferma portieri -->
                        <div v-else class="gk-confirm">
                            <div class="gk-confirm-icon">
                                <i class="fa-solid fa-circle-check"></i>
                            </div>
                            <div class="gk-confirm-names">
                                <h3 v-for="goalkeeper in goalkeepersProvisoryFilter" :key="goalkeeper.id">
                                    {{ goalkeeper.nick_name }}
                                </h3>
                            </div>
                            <p class="gk-confirm-label">
                                {{ goalkeepersProvisoryFilter.length > 1
                                    ? $t('modal.teamsSettings.gks_provisory')
                                    : $t('modal.teamsSettings.gk_provisory') }}
                            </p>
                            <div class="gk-confirm-hints">
                                <span class="hint">{{ $t('modal.teamsSettings.set') }}</span>
                                <span class="hint-sep">{{ $t('modal.teamsSettings.or') }}</span>
                                <span class="hint">{{ $t('modal.teamsSettings.discard') }}</span>
                            </div>
                        </div>
                    </div>
                </template>
            </modal-slide>
        </transition>
    </div>
</template>

<script setup>
import Axios from 'axios'
import { computed, onMounted, ref } from "vue"
import { useStore } from "vuex"
import i18n from '../i18n'
import { useRouter } from "vue-router"
import Search from '../components/Search.vue'
import ModalSlide from '../components/ModalSlide.vue'

const store = useStore()
const router = useRouter()

const modalContent = ref(false)
const choicePossibility = ref(null)
const differenceGk = ref(null)
const players_list = ref('')

const allPossibilities = computed(() => store.state.allPossibilities)
const all_players_availables = computed(() => store.state.all_players_availables)
const all_players_unavailables = computed(() => store.state.all_players_unavailables)

const roleAbbreviation = computed(() => {
    const map = { goalkeeper: 'PT', player: 'PL' }
    return role => map[role]
})

const translate = i18n.global.t.bind(i18n.global)
const apiPath = computed(() => store.getters.apiPath)
const playerNotFound = computed(() => store.getters.playerNotFound)
const showConfirmButton = computed(() => store.getters.showConfirmButton)
const possibilityModal = computed(() => store.state.possibilityModal)
const goalkeepersProvisoryFilter = computed(() =>
    store.state.all_goal_keepers.filter(gk => gk.goalkeeper_provisory)
)

const chooseContentModalPossibility = () => {
    const map = {
        add: translate('modal.teamsSettings.addGk'),
        remove: translate('modal.teamsSettings.removeGk')
    }
    return possibility => map[possibility]
}

const possibilityModalChange = () => store.commit('possibilityModalChange')

function setAvailability(player) {
    store.dispatch('setAvailability', player)
        .then(({ data }) => {
            store.commit('setAllPlayersAvailables', data.all_players_availables)
            store.commit('setAllPlayersUnavailables', data.all_players_unavailables)
            store.commit('setTeamsSettings', data.all_players_availables.length)
            store.commit('resetInputSearch')
        })
        .catch((err) => console.log(err))
}

function setGoalKeepersProvisory(player) {
    store.dispatch('setGoalKeepersProvisory', player)
        .then((res) => {
            store.commit('setAllPlayersAvailables', res.data.all_players_availables_without_gk)
            store.commit('setAllGoalKeepers', res.data.all_gk_and_provisory)
            store.commit('checkOnPossibility', store.state.possibility)
        })
        .catch((err) => console.log(err))
}

function clearGoalKeepersProvisory() {
    store.dispatch('clearGoalKeepersProvisory')
        .then(({ data }) => {
            store.commit('setAllGoalKeepers', [])
            store.commit('setAllPlayersAvailables', data.all_players_availables)
            store.commit('setPossibilityModal', false)
            modalContent.value = false
        })
        .catch((err) => console.log(err))
}

function between(x, min, max) { return x >= min && x <= max }

function setTeamsSettings(players) {
    store.commit('setAllPossibilities', [])
    for (let i = 2; i < 5; i++) {
        const playersForTeam = players / i
        const teams = players / playersForTeam
        if (Number.isInteger(teams) && Number.isInteger(playersForTeam) && between(playersForTeam, 5, 9)) {
            store.commit('setAllPossibilities', { teams, playersForTeam })
        }
    }
}

function checkOnPossibility(possibility) {
    store.commit('setPossibility', possibility)
    if (possibility.teams > store.state.all_goal_keepers.length) {
        modalContent.value = true
        choicePossibility.value = 'add'
        differenceGk.value = possibility.teams - store.state.all_goal_keepers.length
    } else if (possibility.teams < store.state.all_goal_keepers.length) {
        modalContent.value = true
        choicePossibility.value = 'remove'
        differenceGk.value = store.state.all_goal_keepers.length - possibility.teams
    } else {
        modalContent.value = null
    }
}

onMounted(() => {
    Axios
        .get(`${apiPath.value}/players/available_unavailable`)
        .then(({ data }) => {
            store.commit('setAllPlayersAvailables', data.all_players_availables)
            store.commit('setAllPlayersUnavailables', data.all_players_unavailables)
            if (allPossibilities.value.length == 0) {
                setTeamsSettings(data.all_players_availables.length)
            }
            clearGoalKeepersProvisory()
        })
        .catch((err) => console.log(err))
})
</script>

<style lang="scss" scoped>
.choose-view {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.view-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.search-row {
    margin-bottom: 0.25rem;
}

/* Count badges inside accordion buttons */
.count-badge {
    font-family: 'DM Mono', monospace;
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.15rem 0.5rem;
    border-radius: var(--r-pill);
    background: var(--bg-deep);
    color: var(--t2);
    border: 1px solid var(--border-md);
    margin-left: auto;

    &.green {
        background: var(--green-muted);
        color: var(--green);
        border-color: rgba(30,215,96,0.3);
    }
}

/* Empty state */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 2.5rem 1rem;
    color: var(--t3);
    font-size: 0.9rem;

    i { font-size: 1.5rem; }
}

/* Confirm CTA */
.confirm-wrap {
    position: sticky;
    bottom: calc(var(--footer-h) + 0.75rem);
    z-index: 10;
}

.confirm-btn {
    width: 100%;
    padding: 1rem;
    font-size: 1.1rem;
    box-shadow: 0 8px 32px rgba(30,215,96,0.3);
}

/* ─── Bottom sheet styles ─── */
.sheet-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--border-sm);
}

.sheet-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--t1);
}

.sheet-action {
    background: none;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: var(--r-sm);
    transition: background var(--t-fast);

    &.cancel  { color: var(--lv1); }
    &.confirm { color: var(--green); }
    &.dimmed  { color: var(--t3); cursor: not-allowed; }

    &:hover:not(.dimmed) { background: var(--bg-hover); }
}

.sheet-body {
    padding: 1.25rem;
    min-height: 300px;
}

/* Possibilities grid */
.possibilities-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
}

.possibility-btn {
    flex: 1;
    min-width: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    padding: 1.1rem 0.75rem;
    background: var(--bg-elevated);
    border: 1px solid var(--border-md);
    border-radius: var(--r-md);
    color: var(--t1);
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    transition: background var(--t-fast), border-color var(--t-fast), transform var(--t-fast);

    &:hover {
        background: var(--bg-hover);
        border-color: var(--green);
        transform: translateY(-1px);
    }

    &:active { transform: scale(0.97); }

    .poss-teams, .poss-players {
        font-family: 'Barlow Condensed', sans-serif;
        font-size: 1.5rem;
        font-weight: 800;
        color: var(--green);
    }

    .poss-label { color: var(--t2); font-size: 0.8rem; }
    .poss-sep   { color: var(--t3); }
}

/* GK instruction */
.gk-instruction {
    background: var(--bg-elevated);
    border: 1px solid var(--border-sm);
    border-radius: var(--r-md);
    padding: 0.9rem 1rem;
    margin-bottom: 1rem;

    .gk-instruction-text {
        font-size: 0.9rem;
        color: var(--t2);
        strong { color: var(--green); }
    }
}

.sheet-search {
    margin-bottom: 1rem;
}

.gk-list {
    max-height: 340px;
    overflow-y: auto;
}

/* GK confirm */
.gk-confirm {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 0;
    text-align: center;

    .gk-confirm-icon {
        font-size: 3rem;
        color: var(--green);
        animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .gk-confirm-names h3 {
        font-size: 1.6rem;
        color: var(--t1);
    }

    .gk-confirm-label {
        color: var(--t2);
        font-size: 0.9rem;
    }

    .gk-confirm-hints {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        margin-top: 0.5rem;

        .hint { font-size: 0.8rem; color: var(--t3); }
        .hint-sep { font-size: 0.75rem; color: var(--t3); font-style: italic; }
    }
}

@keyframes popIn {
    from { transform: scale(0.5); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
}
</style>
