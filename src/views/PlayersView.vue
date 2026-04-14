<template>
    <div class="players-view">
        <div class="view-topbar">
            <h2 class="section-title">{{ $t('players.all_players') }}</h2>
            <div class="topbar-actions">
                <span class="count-badge">{{ $store.state.all_players.length }}</span>
                <button class="btn-add" @click="openCreate">
                    <i class="fa-solid fa-plus"></i>
                    {{ $t('form.create_player') }}
                </button>
            </div>
        </div>

        <Search :playersFiltered="false" />

        <div class="players-grid">
            <div
                v-for="player in $store.state.all_players"
                :key="player.id"
                class="player-grid-item"
            >
                <PlayerCard :player="player" @click="activateEdit(player)" />
                <button class="btn-delete" @click.stop="confirmDelete(player)" :title="$t('general.delete')">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    </div>

    <!-- Edit modal -->
    <transition name="fade-modal">
        <modal v-if="editModal" @close="editModal = false">
            <template v-slot:header>
                <div class="edit-header">
                    <span class="edit-player-name">{{ activePlayer.name }} {{ activePlayer.surname }}</span>
                    <span class="edit-label">{{ $t('general.edit') }}</span>
                </div>
            </template>
            <template v-slot:body>
                <div class="edit-body">
                    <div class="form-group">
                        <label class="form-label">{{ $t('form.name') }}</label>
                        <input type="text" ref="name" class="form-control"
                            :placeholder="activePlayer.name" :value="activePlayer.name" />
                    </div>
                    <div class="form-group">
                        <label class="form-label">{{ $t('form.surname') }}</label>
                        <input type="text" ref="surname" class="form-control"
                            :placeholder="activePlayer.surname" :value="activePlayer.surname" />
                    </div>
                    <div class="form-group">
                        <label class="form-label">{{ $t('form.nick_name') }}</label>
                        <input type="text" ref="nick_name" class="form-control"
                            :placeholder="activePlayer.nick_name" :value="activePlayer.nick_name" />
                    </div>
                    <div class="form-row-2">
                        <div class="form-group">
                            <label class="form-label">{{ $t('form.level') }}</label>
                            <select ref="level_id" class="form-control">
                                <option
                                    v-for="level in $store.state.levels"
                                    :key="level.id"
                                    :value="level.id"
                                    :selected="level.id == activePlayer.level.id"
                                >{{ level.name }}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">{{ $t('form.role') }}</label>
                            <select v-model="editRoleId" class="form-control">
                                <option :value="1">{{ $t('roles.player') }}</option>
                                <option :value="2">{{ $t('roles.goalkeeper') }}</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group" v-if="editRoleId != 2">
                        <label class="form-label">{{ $t('form.tactical_roles') }}</label>
                        <div class="checkbox-group">
                            <label v-for="role in tacticalRoles" :key="role.id" class="checkbox-label">
                                <input type="checkbox" :value="role.id" v-model="editTacticalRoles" />
                                {{ $t(`roles.${role.name}`) }}
                            </label>
                        </div>
                    </div>
                </div>
            </template>
            <template v-slot:footer>
                <div class="edit-footer">
                    <button class="btn-ghost" @click="editModal = false">{{ $t('general.cancel') }}</button>
                    <button class="btn-cta edit-save-btn" @click="edit">{{ $t('general.save') }}</button>
                </div>
            </template>
        </modal>
    </transition>

    <!-- Create modal -->
    <transition name="fade-modal">
        <modal v-if="createModal" @close="createModal = false">
            <template v-slot:header>
                <div class="edit-header">
                    <span class="edit-player-name">{{ $t('form.create_player') }}</span>
                    <span class="edit-label"><i class="fa-solid fa-plus"></i></span>
                </div>
            </template>
            <template v-slot:body>
                <div class="edit-body">
                    <div class="form-group">
                        <label class="form-label">{{ $t('form.name') }} *</label>
                        <input type="text" ref="createName" class="form-control" placeholder="Nome" />
                    </div>
                    <div class="form-group">
                        <label class="form-label">{{ $t('form.surname') }}</label>
                        <input type="text" ref="createSurname" class="form-control" placeholder="Cognome" />
                    </div>
                    <div class="form-group">
                        <label class="form-label">{{ $t('form.nick_name') }}</label>
                        <input type="text" ref="createNickName" class="form-control" placeholder="Soprannome" />
                    </div>
                    <div class="form-row-2">
                        <div class="form-group">
                            <label class="form-label">{{ $t('form.level') }} *</label>
                            <select ref="createLevel" class="form-control">
                                <option
                                    v-for="level in $store.state.levels"
                                    :key="level.id"
                                    :value="level.id"
                                >{{ level.name }}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">{{ $t('form.role') }}</label>
                            <select v-model="createRoleId" class="form-control">
                                <option value="1">{{ $t('roles.player') }}</option>
                                <option value="2">{{ $t('roles.goalkeeper') }}</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group" v-if="createRoleId != 2">
                        <label class="form-label">{{ $t('form.tactical_roles') }}</label>
                        <div class="checkbox-group">
                            <label v-for="role in tacticalRoles" :key="role.id" class="checkbox-label">
                                <input type="checkbox" :value="role.id" v-model="createTacticalRoles" />
                                {{ $t(`roles.${role.name}`) }}
                            </label>
                        </div>
                    </div>
                    <p v-if="createError" class="form-error">{{ createError }}</p>
                </div>
            </template>
            <template v-slot:footer>
                <div class="edit-footer">
                    <button class="btn-ghost" @click="createModal = false">{{ $t('general.cancel') }}</button>
                    <button class="btn-cta edit-save-btn" @click="createPlayer">{{ $t('general.save') }}</button>
                </div>
            </template>
        </modal>
    </transition>
</template>

<script>
import PlayerCard from '../components/PlayerCard.vue'
import Modal from '../components/Modal.vue'
import Search from '../components/Search.vue'

export default {
    name: 'PlayersView',
    components: { PlayerCard, Modal, Search },
    data() {
        return {
            editModal: false,
            createModal: false,
            activePlayer: null,
            editTacticalRoles: [],
            editRoleId: 1,
            createRoleId: '1',
            createTacticalRoles: [],
            createError: null
        }
    },
    computed: {
        tacticalRoles() {
            return this.$store.state.roles.filter(r => [3, 4, 5].includes(r.id))
        }
    },
    methods: {
        activateEdit(player) {
            this.activePlayer = player
            this.editTacticalRoles = player.roles ? player.roles.map(r => r.id) : []
            this.editRoleId = player.role ? player.role.id : 1
            this.editModal = true
        },
        openCreate() {
            this.createRoleId = '1'
            this.createTacticalRoles = []
            this.createError = null
            this.createModal = true
        },
        edit() {
            this.$http
                .post(`${this.$store.getters.apiPath}/player/update`, {
                    id: this.activePlayer.id,
                    name: this.$refs.name.value,
                    surname: this.$refs.surname.value || null,
                    nick_name: this.$refs.nick_name.value || null,
                    level_id: this.$refs.level_id.value,
                    role_id: this.editRoleId,
                    roles: this.editRoleId === 2 ? [] : this.editTacticalRoles
                })
                .then((res) => {
                    if (res.data.errors) {
                        console.log(res)
                    } else {
                        this.editModal = false
                        this.$store.state.successHeader = this.$t('modal.success.edited')
                        this.$store.state.successModal = true
                        this.$store.state.all_players = res.data.all_players
                        if (this.$store.state.inputSearch !== '') {
                            this.$store.state.inputSearch = ''
                        }
                        setTimeout(() => { this.$store.state.successModal = false }, 1500)
                    }
                })
                .catch((err) => {
                    this.$store.state.serverModal = true
                    this.$store.state.errServer = err.message
                })
        },
        createPlayer() {
            this.createError = null
            const name = this.$refs.createName.value.trim()
            if (!name) { this.createError = 'Il nome è obbligatorio'; return }

            this.$http
                .post(`${this.$store.getters.apiPath}/player/create`, {
                    name,
                    surname: this.$refs.createSurname.value.trim() || null,
                    nick_name: this.$refs.createNickName.value.trim() || null,
                    level_id: parseInt(this.$refs.createLevel.value),
                    role_id: parseInt(this.createRoleId),
                    roles: parseInt(this.createRoleId) === 2 ? [] : this.createTacticalRoles
                })
                .then((res) => {
                    if (res.data.errors) {
                        this.createError = res.data.errors[0]?.msg || 'Errore'
                    } else {
                        this.createModal = false
                        this.$store.state.successHeader = this.$t('modal.success.created')
                        this.$store.state.successModal = true
                        this.$store.state.all_players = res.data.all_players
                        setTimeout(() => { this.$store.state.successModal = false }, 1500)
                    }
                })
                .catch((err) => {
                    this.$store.state.serverModal = true
                    this.$store.state.errServer = err.message
                })
        },
        confirmDelete(player) {
            if (!confirm(`Eliminare ${player.nick_name || player.name}?`)) return
            this.$http
                .delete(`${this.$store.getters.apiPath}/player/${player.id}`)
                .then((res) => {
                    this.$store.state.successHeader = this.$t('modal.success.deleted')
                    this.$store.state.successModal = true
                    this.$store.state.all_players = res.data.all_players
                    setTimeout(() => { this.$store.state.successModal = false }, 1500)
                })
                .catch((err) => {
                    this.$store.state.serverModal = true
                    this.$store.state.errServer = err.message
                })
        }
    },
    created() {
        this.$http
            .get(`${this.$store.getters.apiPath}/players`)
            .then((res) => { this.$store.state.all_players = res.data.all_players })
            .catch((err) => {
                this.$store.state.serverModal = true
                this.$store.state.errServer = err.message
            })
        if (this.$store.state.roles.length === 0) {
            this.$store.dispatch('fetchRoles')
        }
    }
}
</script>

<style lang="scss" scoped>
.players-view {
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
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

.count-badge {
    font-family: 'DM Mono', monospace;
    font-size: 0.9rem;
    padding: 0.25rem 0.65rem;
    background: var(--bg-elevated);
    border: 1px solid var(--border-md);
    border-radius: var(--r-pill);
    color: var(--t2);
}

.btn-add {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    background: var(--green-muted);
    border: 1px solid rgba(30,215,96,0.3);
    color: var(--green);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.4rem 0.75rem;
    border-radius: var(--r-pill);
    cursor: pointer;
    transition: background var(--t-fast);

    &:hover { background: rgba(30,215,96,0.2); }
}

.players-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
}

.player-grid-item {
    min-height: 160px;
    position: relative;
}

.btn-delete {
    position: absolute;
    top: 0.4rem;
    right: 0.4rem;
    background: rgba(239,68,68,0.12);
    border: 1px solid rgba(239,68,68,0.25);
    color: var(--lv1);
    border-radius: var(--r-xs);
    padding: 0.3rem 0.45rem;
    font-size: 0.7rem;
    cursor: pointer;
    z-index: 2;
    transition: background var(--t-fast);

    &:hover { background: rgba(239,68,68,0.25); }
}

/* Edit / Create modal */
.edit-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.1rem 1.25rem;
    border-bottom: 1px solid var(--border-sm);
}

.edit-player-name {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.3rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--t1);
}

.edit-label {
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--t2);
    text-transform: uppercase;
    letter-spacing: 0.06em;
}

.edit-body {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}

.form-row-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
}

.checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.88rem;
    color: var(--t2);
    cursor: pointer;

    input[type="checkbox"] {
        accent-color: var(--green);
        width: 15px;
        height: 15px;
    }
}

.form-error {
    color: var(--lv1);
    font-size: 0.82rem;
    margin: 0;
}

.edit-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    border-top: 1px solid var(--border-sm);
}

.edit-save-btn {
    padding: 0.65rem 1.5rem;
    font-size: 1rem;
}
</style>
