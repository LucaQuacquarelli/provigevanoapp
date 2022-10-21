<template>
    <div class="d-flex justify-content-around flex-wrap">
        <div class="col-12 d-flex justify-content-between align-items-center">
            <h2>
                {{ $t('players.all_players') }}
            </h2>
            <h2 class="badge bg-dark">
                {{ this.$store.state.all_players.length }}
            </h2>
        </div>
        <div class="col-12 my-4">
            <input type="text" class="form-control" :placeholder="$t('general.search')" v-model="this.$store.state.inputSearch" @keyup="this.$store.dispatch('searchPlayers')">
        </div>
        <div v-for="player in this.$store.state.all_players" :key="player.id" class="col-5 mb-4 overflow-hidden">
            <PlayerCard :player="player" @click="activateEdit(player)"/>
            <!-- TODO -->
            <!-- <PlayerCard :player="player" @dblclick="editModal = true"/> -->
        </div>
    </div>
    <transition ref="fade-modal">
        <modal v-if="editModal" @close="editModal = false">
            <template v-slot:header>
                <div class="modal-header d-flex justify-content-between align-items-center py-2 px-4">
                    <span class="fs-2 fw-bold text-uppercase">
                        {{ activeEditPlayer.name }}
                        {{ activeEditPlayer.surname }}
                    </span>
                    <span class="fs-2 fw-bold">
                        {{ $t('general.edit') }}
                    </span>
                </div>
            </template>
            <template v-slot:body>
                <div class="modal-body d-flex justify-content-between flex-wrap my-4 px-4">
                    <div class="col-12">
                        <label class="form-label">
                            {{ $t('form.name') }}
                        </label>
                        <input type="text" ref="name" class="form-control" :placeholder="activeEditPlayer.name" :value="activeEditPlayer.name">
                    </div>
                    <div class="col-12">
                        <label class="form-label mt-2">
                            {{ $t('form.surname') }}
                        </label>
                        <input type="text" ref="surname" class="form-control" :placeholder="activeEditPlayer.surname" :value="activeEditPlayer.surname">
                    </div>
                    <div class="col-12">
                        <label class="form-label mt-2">
                            {{ $t('form.nick_name') }}
                        </label>
                        <input type="text" ref="nick_name" class="form-control" :placeholder="activeEditPlayer.nick_name" :value="activeEditPlayer.nick_name">
                    </div>
                    <div class="col-5">
                        <label class="form-label mt-2">
                            {{ $t('form.goalkeeper_provisory') }}
                        </label>
                        <input type="checkbox" ref="goalkeeper_provisory" class="form-check" disabled>
                    </div>
                    <div class="col-5">
                        <label class="form-label mt-2">
                            {{ $t('form.level') }}
                        </label>
                        <select ref="level_id">
                            <option v-for="level in this.$store.state.levels" :key="level.id" :value="level.id" :selected="level.id == activeEditPlayer.level.id">
                                {{ level.name }}
                            </option>
                        </select>
                    </div>
                </div>
            </template>
            <template v-slot:footer>
                <div class="modal-footer d-flex justify-content-between align-items-center py-2 px-4">
                    <button class="btn btn-secondary" @click="editModal = false">
                        {{ $t('general.cancel') }}
                    </button>
                    <button @click="edit" class="btn btn-primary">
                        {{ $t('general.save') }}
                    </button>
                </div>
            </template>
        </modal>
    </transition>
</template>

<script>
import PlayerCard from '../components/PlayerCard.vue';
import Modal from '../components/Modal.vue';
export default {
    name: 'PlayersView',
    components: {
        PlayerCard,
        Modal
    },
    data() {
        return {
            editModal: false,
            activeEditPlayer: null
        }
    },
    methods: {
        activateEdit(player) {
            this.editModal = true
            this.activeEditPlayer = player
        },
        edit() {
            this.$http
                .post(`${this.$store.getters.apiPath}/player/update`,
                    {
                        id: this.activeEditPlayer.id,
                        name: this.$refs.name.value,
                        surname: this.$refs.surname.value,
                        nick_name: this.$refs.nick_name.value,
                        level_id: this.$refs.level_id.value,
                    }
                )
                .then((res) => {
                    if (res.data.errors) {
                        /**
                         *TODO add modal errors
                         */
                        console.log("🚀 ~ file: PlayersView.vue ~ line 134 ~ .then ~ res", res)
                    }else{
                        this.editModal = false
                        this.$store.state.successHeader = this.$t("modal.success.edited")
                        this.$store.state.successModal = true
                        this.$store.state.all_players = res.data.all_players
                        if (this.$store.state.inputSearch != "") {
                            this.$store.state.inputSearch = ""
                        }
                        setTimeout(() => {
                            this.$store.state.successModal = false
                        }, 1500);
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
            .then((res) => {
                this.$store.state.all_players = res.data.all_players
            })
            .catch((err) => {
                this.$store.state.serverModal = true
                this.$store.state.errServer = err.message
            }) 
    }
}
</script>

<style lang="scss" scoped>
    .rounded {
        border-radius: 30px !important;
        border: 2px solid red;
    }
</style>