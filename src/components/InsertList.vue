<template>
    <div class="insert-list">
        <div class="insert-header">
            <i class="fa-solid fa-list-ol"></i>
            <span class="insert-title">{{ $t('insert_list.title') }}</span>
        </div>

        <div v-if="!preview">
            <textarea
                v-model="pasteInput"
                class="insert-textarea"
                :placeholder="$t('insert_list.placeholder')"
                rows="6"
            ></textarea>
            <button class="btn-analyze" @click="analyze" :disabled="loading || !pasteInput.trim()">
                <i class="fa-solid fa-magnifying-glass"></i>
                {{ loading ? '...' : $t('insert_list.analyze') }}
            </button>
        </div>

        <div v-else class="preview">
            <!-- TROVATI (auto + manuali + creati) -->
            <div class="preview-section matched">
                <div class="preview-header">
                    <i class="fa-solid fa-circle-check"></i>
                    <span>{{ $t('insert_list.matched') }} ({{ preview.matched.length + manualMatches.length + ambiguousResolved.length }})</span>
                </div>
                <div class="preview-list">
                    <div v-for="p in preview.matched" :key="'auto-' + p.id" class="preview-item matched-item">
                        <span class="preview-nick">{{ p.nick_name || p.name }}</span>
                        <span class="preview-name">{{ p.name }}</span>
                    </div>
                    <div v-for="p in ambiguousResolved" :key="'ambig-' + p.id" class="preview-item matched-item manual">
                        <span class="preview-nick">{{ p.nick_name || p.name }}</span>
                        <span class="preview-name">{{ p.name }}</span>
                        <span class="manual-badge"><i class="fa-solid fa-circle-question"></i></span>
                    </div>
                    <div v-for="p in manualMatches" :key="'manual-' + p.id" class="preview-item matched-item manual">
                        <span class="preview-nick">{{ p.nick_name || p.name }}</span>
                        <span class="preview-name">{{ p.name }}</span>
                        <span class="manual-badge">
                            <i :class="p._created ? 'fa-solid fa-plus' : 'fa-solid fa-link'"></i>
                        </span>
                    </div>
                </div>
            </div>

            <!-- AMBIGUI: più giocatori con lo stesso nome -->
            <div v-if="ambiguousActive.length" class="preview-section ambiguous">
                <div class="preview-header">
                    <i class="fa-solid fa-circle-question"></i>
                    <span>{{ $t('insert_list.ambiguous') }} ({{ ambiguousActive.length }})</span>
                </div>
                <div class="preview-list">
                    <div v-for="entry in ambiguousActive" :key="entry.inputName">
                        <div class="preview-item ambiguous-item">
                            <span class="unmatched-name">{{ entry.inputName }}</span>
                            <span class="ambiguous-hint">{{ $t('insert_list.ambiguous_hint') }}</span>
                        </div>
                        <div class="assign-panel">
                            <div class="assign-list">
                                <div
                                    v-for="p in entry.candidates"
                                    :key="p.id"
                                    class="assign-item"
                                    @click="resolveAmbiguous(entry.inputName, p)"
                                >
                                    <span class="assign-nick">{{ p.nick_name || p.name }}</span>
                                    <span class="assign-name">{{ p.name }} {{ p.surname }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- NON TROVATI con assegnazione / creazione -->
            <div v-if="unmatchedActive.length" class="preview-section unmatched">
                <div class="preview-header">
                    <i class="fa-solid fa-circle-xmark"></i>
                    <span>{{ $t('insert_list.unmatched') }} ({{ unmatchedActive.length }})</span>
                </div>
                <div class="preview-list">
                    <div v-for="name in unmatchedActive" :key="name">
                        <!-- Riga nome + pulsanti -->
                        <div class="preview-item unmatched-item">
                            <span class="unmatched-name">{{ name }}</span>
                            <div class="unmatched-actions">
                                <button
                                    class="btn-assign"
                                    @click="togglePanel(name, 'assign')"
                                    :class="{ active: activePanel.name === name && activePanel.type === 'assign' }"
                                >
                                    <i class="fa-solid fa-link"></i>
                                    {{ $t('insert_list.assign') }}
                                </button>
                                <button
                                    class="btn-create-inline"
                                    @click="togglePanel(name, 'create')"
                                    :class="{ active: activePanel.name === name && activePanel.type === 'create' }"
                                >
                                    <i class="fa-solid fa-plus"></i>
                                    {{ $t('insert_list.create') }}
                                </button>
                            </div>
                        </div>

                        <!-- Pannello Assegna -->
                        <div v-if="activePanel.name === name && activePanel.type === 'assign'" class="assign-panel">
                            <input
                                v-model="assignSearch"
                                class="assign-search"
                                :placeholder="$t('insert_list.assign_search')"
                                autofocus
                            />
                            <div class="assign-list">
                                <div
                                    v-for="p in assignablePlayers"
                                    :key="p.id"
                                    class="assign-item"
                                    @click="assignPlayer(name, p)"
                                >
                                    <span class="assign-nick">{{ p.nick_name || p.name }}</span>
                                    <span class="assign-name">{{ p.name }}</span>
                                </div>
                                <div v-if="!assignablePlayers.length" class="assign-empty">
                                    Nessun giocatore trovato
                                </div>
                            </div>
                        </div>

                        <!-- Pannello Crea -->
                        <div v-if="activePanel.name === name && activePanel.type === 'create'" class="create-panel">
                            <div class="create-form">
                                <div class="create-field">
                                    <label class="create-label">{{ $t('form.name') }} *</label>
                                    <input v-model="createForm.name" class="create-input" />
                                </div>
                                <div class="create-field">
                                    <label class="create-label">{{ $t('form.nick_name') }}</label>
                                    <input v-model="createForm.nick_name" class="create-input" :placeholder="name" />
                                </div>
                                <div class="create-row-2">
                                    <div class="create-field">
                                        <label class="create-label">{{ $t('form.level') }}</label>
                                        <select v-model="createForm.level_id" class="create-input">
                                            <option v-for="level in store.state.levels" :key="level.id" :value="level.id">
                                                {{ level.name }}
                                            </option>
                                        </select>
                                    </div>
                                    <div class="create-field">
                                        <label class="create-label">{{ $t('form.role') }}</label>
                                        <select v-model="createForm.role_id" class="create-input">
                                            <option :value="1">{{ $t('roles.player') }}</option>
                                            <option :value="2">{{ $t('roles.goalkeeper') }}</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="create-field" v-if="createForm.role_id != 2">
                                    <label class="create-label">{{ $t('form.tactical_roles') }}</label>
                                    <div class="create-checkboxes">
                                        <label v-for="role in tacticalRoles" :key="role.id" class="create-checkbox-label">
                                            <input type="checkbox" :value="role.id" v-model="createForm.tactical_roles" />
                                            {{ $t(`roles.${role.name}`) }}
                                        </label>
                                    </div>
                                </div>
                                <p v-if="createError" class="create-error">{{ createError }}</p>
                                <button class="btn-create-save" @click="createPlayer(name)" :disabled="createLoading">
                                    <i class="fa-solid fa-floppy-disk"></i>
                                    {{ createLoading ? '...' : $t('general.save') }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="preview-actions">
                <button class="btn-ghost preview-reset" @click="reset">
                    {{ $t('insert_list.reset') }}
                </button>
                <button
                    class="btn-cta preview-confirm"
                    @click="confirm"
                    :disabled="loading || (preview.matched.length + manualMatches.length + ambiguousResolved.length) === 0"
                >
                    <i class="fa-solid fa-check"></i>
                    {{ loading ? '...' : $t('insert_list.confirm') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Axios from 'axios'

const store = useStore()
const router = useRouter()

const pasteInput = ref('')
const preview = ref(null)
const loading = ref(false)

const manualMatches = ref([])
const ambiguousResolved = ref([])
const activePanel = reactive({ name: null, type: null })
const assignSearch = ref('')

const createForm = reactive({ name: '', nick_name: '', level_id: 3, role_id: 1, tactical_roles: [] })
const createError = ref(null)
const createLoading = ref(false)

function normalizeStr(s) {
    return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function parseList(text) {
    const raw = text
        .split('\n')
        .map(line =>
            line
                .replace(/^\d+[\s.)-]*/, '')
                .replace(/[^\p{L}\p{N}\s]/gu, '')
                .trim()
        )
        .filter(Boolean)
    return [...new Map(raw.map(n => [normalizeStr(n), n])).values()]
}

const tacticalRoles = computed(() => store.state.roles.filter(r => [3, 4, 5].includes(r.id)))

const unmatchedActive = computed(() => {
    if (!preview.value) return []
    const assignedNames = new Set(manualMatches.value.map(p => p._assignedName))
    return preview.value.unmatched.filter(n => !assignedNames.has(n))
})

const ambiguousActive = computed(() => {
    if (!preview.value) return []
    const resolvedNames = new Set(ambiguousResolved.value.map(r => r._assignedName))
    return (preview.value.ambiguous || []).filter(a => !resolvedNames.has(a.inputName))
})

const assignablePlayers = computed(() => {
    if (!preview.value) return []
    const usedIds = new Set([
        ...preview.value.matched.map(p => p.id),
        ...manualMatches.value.map(p => p.id)
    ])
    return (preview.value.allPlayers || [])
        .filter(p => !usedIds.has(p.id))
        .filter(p => {
            if (!assignSearch.value.trim()) return true
            const s = normalizeStr(assignSearch.value)
            return normalizeStr(p.nick_name || '').includes(s) || normalizeStr(p.name || '').includes(s)
        })
})

async function analyze() {
    const names = parseList(pasteInput.value)
    if (names.length === 0) return
    loading.value = true
    try {
        const { data } = await Axios.post(`${store.getters.apiPath}/players/match_names`, { names })
        preview.value = data
        manualMatches.value = []
        ambiguousResolved.value = []
        activePanel.name = null
        activePanel.type = null
        assignSearch.value = ''
    } finally {
        loading.value = false
    }
}

function resolveAmbiguous(inputName, player) {
    ambiguousResolved.value.push({ ...player, _assignedName: inputName })
}

function togglePanel(name, type) {
    if (activePanel.name === name && activePanel.type === type) {
        activePanel.name = null
        activePanel.type = null
    } else {
        activePanel.name = name
        activePanel.type = type
        assignSearch.value = ''
        createError.value = null
        createForm.name = name
        createForm.nick_name = ''
        createForm.level_id = store.state.levels[2]?.id || 3
        createForm.role_id = 1
        createForm.tactical_roles = []
    }
}

function assignPlayer(unmatchedName, player) {
    manualMatches.value.push({ ...player, _assignedName: unmatchedName, _created: false })
    activePanel.name = null
    activePanel.type = null
    assignSearch.value = ''
}

async function createPlayer(unmatchedName) {
    createError.value = null
    if (!createForm.name.trim()) { createError.value = 'Il nome è obbligatorio'; return }
    createLoading.value = true
    try {
        const { data } = await Axios.post(`${store.getters.apiPath}/player/create`, {
            name: createForm.name.trim(),
            nick_name: createForm.nick_name.trim() || null,
            level_id: parseInt(createForm.level_id),
            role_id: parseInt(createForm.role_id),
            roles: parseInt(createForm.role_id) === 2 ? [] : createForm.tactical_roles
        })
        if (data.errors) {
            createError.value = data.errors[0]?.msg || 'Errore'
            return
        }
        // Find the newly created player in the response
        const newPlayer = data.all_players.find(p =>
            p.name === createForm.name.trim() &&
            (createForm.nick_name ? p.nick_name === createForm.nick_name.trim() : true)
        ) || data.all_players[data.all_players.length - 1]

        // Update store all_players
        store.state.all_players = data.all_players

        manualMatches.value.push({ ...newPlayer, _assignedName: unmatchedName, _created: true })
        activePanel.name = null
        activePanel.type = null
    } catch (err) {
        createError.value = err.message
    } finally {
        createLoading.value = false
    }
}

async function confirm() {
    if (!preview.value) return
    if (preview.value.matched.length + manualMatches.value.length === 0) return
    loading.value = true
    try {
        const playerIds = [
            ...preview.value.matched.map(p => p.id),
            ...ambiguousResolved.value.map(p => p.id),
            ...manualMatches.value.map(p => p.id)
        ]
        const { data } = await Axios.post(`${store.getters.apiPath}/players/set_available_by_names`, { playerIds })
        store.commit('setAllPlayersAvailables', data.all_players_availables)
        store.commit('setAllPlayersUnavailables', data.all_players_unavailables)
        store.commit('setTeamsSettings', data.all_players_availables.length)
        router.push('/choose_players')
    } finally {
        loading.value = false
    }
}

function reset() {
    pasteInput.value = ''
    preview.value = null
    manualMatches.value = []
    ambiguousResolved.value = []
    activePanel.name = null
    activePanel.type = null
    assignSearch.value = ''
    createError.value = null
}
</script>

<style lang="scss" scoped>
.insert-list {
    width: 100%;
    background: var(--bg-card);
    border: 1px solid var(--border-sm);
    border-radius: var(--r-md);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
}

.insert-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--t2);
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;

    i { color: var(--green); }
}

.insert-title { color: var(--t1); }

.insert-textarea {
    width: 100%;
    background: var(--bg-elevated);
    border: 1px solid var(--border-md);
    border-radius: var(--r-sm);
    color: var(--t1);
    font-family: 'DM Mono', monospace;
    font-size: 0.82rem;
    padding: 0.75rem;
    resize: none;
    box-sizing: border-box;

    &::placeholder { color: var(--t3); }
    &:focus { outline: none; border-color: var(--green); }
}

.btn-analyze {
    width: 100%;
    margin-top: 0.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    background: var(--bg-elevated);
    border: 1px solid var(--border-md);
    color: var(--t1);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    padding: 0.65rem 1rem;
    border-radius: var(--r-pill);
    cursor: pointer;
    transition: background var(--t-fast), border-color var(--t-fast);

    &:hover:not(:disabled) { background: var(--bg-hover); border-color: var(--green); }
    &:disabled { opacity: 0.4; cursor: not-allowed; }
}

.preview {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
}

.preview-section {
    border-radius: var(--r-sm);
    overflow: hidden;
}

.preview-header {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 0.5rem 0.75rem;

    .matched & { background: rgba(30,215,96,0.1); color: var(--green); }
    .unmatched & { background: rgba(249,115,22,0.1); color: #f97316; }
    .ambiguous & { background: rgba(234,179,8,0.1); color: #eab308; }
}

.preview-list {
    display: flex;
    flex-direction: column;
    background: var(--bg-elevated);
    border: 1px solid var(--border-sm);
    border-top: none;
    border-radius: 0 0 var(--r-sm) var(--r-sm);
}

.preview-item {
    padding: 0.45rem 0.75rem;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-bottom: 1px solid var(--border-sm);
}

.matched-item { color: var(--t1); }

.matched-item.manual {
    background: rgba(30,215,96,0.04);
}

.manual-badge {
    margin-left: auto;
    font-size: 0.7rem;
    color: var(--green);
    opacity: 0.7;
}

.unmatched-item {
    color: #f97316;
    border-bottom: 1px solid var(--border-sm);
    flex-wrap: wrap;
    gap: 0.4rem;
}

.ambiguous-item {
    color: #eab308;
    border-bottom: 1px solid var(--border-sm);
    flex-wrap: wrap;
    gap: 0.4rem;
}

.ambiguous-hint {
    font-size: 0.72rem;
    color: var(--t3);
    font-style: italic;
    margin-left: auto;
}

.unmatched-name {
    flex: 1;
    font-family: 'DM Mono', monospace;
    font-size: 0.82rem;
    min-width: 60px;
}

.unmatched-actions {
    display: flex;
    gap: 0.35rem;
    flex-shrink: 0;
}

.btn-assign, .btn-create-inline {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.72rem;
    font-weight: 600;
    padding: 0.22rem 0.5rem;
    border-radius: var(--r-pill);
    cursor: pointer;
    transition: background var(--t-fast);
    white-space: nowrap;
}

.btn-assign {
    background: rgba(249,115,22,0.1);
    border: 1px solid rgba(249,115,22,0.3);
    color: #f97316;

    &:hover, &.active { background: rgba(249,115,22,0.2); }
}

.btn-create-inline {
    background: rgba(30,215,96,0.1);
    border: 1px solid rgba(30,215,96,0.3);
    color: var(--green);

    &:hover, &.active { background: rgba(30,215,96,0.2); }
}

/* Assign panel */
.assign-panel {
    background: var(--bg-deep);
    border-bottom: 1px solid var(--border-sm);
    padding: 0.6rem 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.assign-search {
    width: 100%;
    background: var(--bg-elevated);
    border: 1px solid var(--border-md);
    border-radius: var(--r-sm);
    color: var(--t1);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    padding: 0.45rem 0.65rem;
    box-sizing: border-box;

    &::placeholder { color: var(--t3); }
    &:focus { outline: none; border-color: var(--green); }
}

.assign-list {
    display: flex;
    flex-direction: column;
    max-height: 180px;
    overflow-y: auto;
    border: 1px solid var(--border-sm);
    border-radius: var(--r-sm);
    background: var(--bg-card);
}

.assign-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.45rem 0.65rem;
    cursor: pointer;
    border-bottom: 1px solid var(--border-sm);
    transition: background var(--t-fast);

    &:last-child { border-bottom: none; }
    &:hover { background: var(--bg-hover); }
}

.assign-nick {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: var(--t1);
    letter-spacing: 0.03em;
}

.assign-name { font-size: 0.78rem; color: var(--t2); }

.assign-empty {
    padding: 0.6rem 0.65rem;
    font-size: 0.82rem;
    color: var(--t3);
    text-align: center;
}

/* Create panel */
.create-panel {
    background: var(--bg-deep);
    border-bottom: 1px solid var(--border-sm);
    padding: 0.7rem 0.75rem;
}

.create-form {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
}

.create-field {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}

.create-label {
    font-size: 0.72rem;
    color: var(--t2);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.create-input {
    background: var(--bg-elevated);
    border: 1px solid var(--border-md);
    border-radius: var(--r-sm);
    color: var(--t1);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    padding: 0.4rem 0.6rem;
    width: 100%;
    box-sizing: border-box;

    &:focus { outline: none; border-color: var(--green); }
}

.create-row-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
}

.create-checkboxes {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    padding-top: 0.1rem;
}

.create-checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.82rem;
    color: var(--t2);
    cursor: pointer;

    input[type="checkbox"] { accent-color: var(--green); }
}

.create-error {
    font-size: 0.78rem;
    color: var(--lv1);
    margin: 0;
}

.btn-create-save {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    background: var(--green-muted);
    border: 1px solid rgba(30,215,96,0.3);
    color: var(--green);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    padding: 0.5rem 1rem;
    border-radius: var(--r-pill);
    cursor: pointer;
    width: 100%;
    transition: background var(--t-fast);

    &:hover:not(:disabled) { background: rgba(30,215,96,0.2); }
    &:disabled { opacity: 0.4; cursor: not-allowed; }
}

/* Preview nick/name */
.preview-nick {
    font-weight: 700;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1rem;
    letter-spacing: 0.03em;
}

.preview-name { font-size: 0.78rem; color: var(--t2); }

.preview-actions {
    display: flex;
    gap: 0.6rem;
}

.preview-reset {
    flex: 0 0 auto;
    padding: 0.65rem 1rem;
    font-size: 0.9rem;
}

.preview-confirm {
    flex: 1;
    padding: 0.65rem 1rem;
    font-size: 0.9rem;
    justify-content: center;

    &:disabled { opacity: 0.4; cursor: not-allowed; }
}
</style>
