<template>
    <div class="players-view">
        <div class="view-topbar">
            <h2 class="section-title">{{ $t('players.all_players') }}</h2>
            <span class="count-badge">{{ this.$store.state.all_players.length }}</span>
        </div>

        <Search :playersFiltered="false" />

        <div class="players-grid">
            <div
                v-for="player in this.$store.state.all_players"
                :key="player.id"
                class="player-grid-item"
                @click="activateEdit(player)"
            >
                <PlayerCard :player="player" />
            </div>
        </div>
    </div>

    <transition name="fade-modal">
        <modal v-if="editModal" @close="editModal = false">
            <template v-slot:header>
                <div class="edit-header">
                    <span class="edit-player-name">{{ activeEditPlayer.name }} {{ activeEditPlayer.surname }}</span>
                    <span class="edit-label">{{ $t('general.edit') }}</span>
                </div>
            </template>
            <template v-slot:body>
                <div class="edit-body">
                    <div class="form-group">
                        <label class="form-label">{{ $t('form.name') }}</label>
                        <input type="text" ref="name" class="form-control"
                            :placeholder="activeEditPlayer.name" :value="activeEditPlayer.name" />
                    </div>
                    <div class="form-group">
                        <label class="form-label">{{ $t('form.surname') }}</label>
                        <input type="text" ref="surname" class="form-control"
                            :placeholder="activeEditPlayer.surname" :value="activeEditPlayer.surname" />
                    </div>
                    <div class="form-group">
                        <label class="form-label">{{ $t('form.nick_name') }}</label>
                        <input type="text" ref="nick_name" class="form-control"
                            :placeholder="activeEditPlayer.nick_name" :value="activeEditPlayer.nick_name" />
                    </div>
                    <div class="form-row-2">
                        <div class="form-group">
                            <label class="form-label">{{ $t('form.level') }}</label>
                            <select ref="level_id" class="form-control">
                                <option
                                    v-for="level in this.$store.state.levels"
                                    :key="level.id"
                                    :value="level.id"
                                    :selected="level.id == activeEditPlayer.level.id"
                                >
                                    {{ level.name }}
                                </option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">{{ $t('form.goalkeeper_provisory') }}</label>
                            <input type="checkbox" ref="goalkeeper_provisory" class="form-check" disabled />
                        </div>
                    </div>
                </div>
            </template>
            <template v-slot:footer>
                <div class="edit-footer">
                    <button class="btn-ghost" @click="editModal = false">
                        {{ $t('general.cancel') }}
                    </button>
                    <button class="btn-cta edit-save-btn" @click="edit">
                        {{ $t('general.save') }}
                    </button>
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
        return { editModal: false, activeEditPlayer: null }
    },
    methods: {
        activateEdit(player) {
            this.editModal = true
            this.activeEditPlayer = player
        },
        edit() {
            this.$http
                .post(`${this.$store.getters.apiPath}/player/update`, {
                    id: this.activeEditPlayer.id,
                    name: this.$refs.name.value,
                    surname: this.$refs.surname.value,
                    nick_name: this.$refs.nick_name.value,
                    level_id: this.$refs.level_id.value,
                })
                .then((res) => {
                    if (res.data.errors) {
                        console.log(res)
                    } else {
                        this.editModal = false
                        this.$store.state.successHeader = this.$t("modal.success.edited")
                        this.$store.state.successModal = true
                        this.$store.state.all_players = res.data.all_players
                        if (this.$store.state.inputSearch !== "") {
                            this.$store.state.inputSearch = ""
                        }
                        setTimeout(() => { this.$store.state.successModal = false }, 1500)
                    }
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
            .then((res) => { this.$store.state.all_players = res.data })
            .catch((err) => {
                this.$store.state.serverModal = true
                this.$store.state.errServer = err.message
            })
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

.count-badge {
    font-family: 'DM Mono', monospace;
    font-size: 0.9rem;
    padding: 0.25rem 0.65rem;
    background: var(--bg-elevated);
    border: 1px solid var(--border-md);
    border-radius: var(--r-pill);
    color: var(--t2);
}

.players-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
}

.player-grid-item {
    min-height: 160px;
}

/* Edit modal */
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
