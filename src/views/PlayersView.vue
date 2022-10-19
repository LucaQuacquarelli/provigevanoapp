<template>
    <div class="d-flex justify-content-around flex-wrap">
        <div class="col-12 d-flex justify-content-between align-items-center">
            <h2>
                All Players
            </h2>
            <h2>
                {{ this.$store.state.all_players.length }}
            </h2>
        </div>
        <div class="col-12 my-4">
            <input type="text" class="form-control" placeholder="search" v-model="inputSearch" @keyup="searchPlayers">
        </div>
        <div v-for="player in this.$store.state.all_players" :key="player.id" class="col-5 mb-4">
            <PlayerCard :player="player" @click="activateEdit(player)"/>
            <!-- <PlayerCard :player="player" :level="{}" @dblclick="editModal = true"/> -->
        </div>
    </div>
    <transition ref="fade-modal">
        <modal v-if="editModal" @close="editModal = false">
            <template v-slot:header>
                <div class="modal-header d-flex justify-content-between align-items-center">
                    <span class="fs-2 fw-bold text-uppercase">
                        {{ activeEditPlayer.name }}
                        {{ activeEditPlayer.surname }}
                    </span>
                    <span class="fs-2 fw-bold">
                        Edit 
                    </span>
                </div>
            </template>
            <template v-slot:body>
                <div class="modal-body d-flex justify-content-between flex-wrap my-4">
                    <div class="col-12">
                        <label class="form-label">
                            Name
                        </label>
                        <input type="text" ref="name" class="form-control" :placeholder="activeEditPlayer.name" :value="activeEditPlayer.name">
                    </div>
                    <div class="col-12">
                        <label class="form-label mt-2">
                            Surname
                        </label>
                        <input type="text" ref="surname" class="form-control" :placeholder="activeEditPlayer.surname" :value="activeEditPlayer.surname">
                    </div>
                    <div class="col-12">
                        <label class="form-label mt-2">
                            NickName
                        </label>
                        <input type="text" ref="nick_name" class="form-control" :placeholder="activeEditPlayer.nick_name" :value="activeEditPlayer.nick_name">
                    </div>
                    <div class="col-5">
                        <label class="form-label mt-2">
                            Goalkeeper Provisory
                        </label>
                        <input type="checkbox" ref="goalkeeper_provisory" class="form-check" disabled>
                    </div>
                    <div class="col-5">
                        <label class="form-label mt-2">
                            Level
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
                <div class="modal-footer d-flex justify-content-between align-items-center">
                    <button class="btn btn-secondary" @click="editModal = false">
                        Cancel
                    </button>
                    <button @click="edit" class="btn btn-primary">
                        Submit
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
            inputSearch: '',
            editModal: false,
            activeEditPlayer: null
        }
    },
    methods: {
        searchPlayers() {
            this.$http
                .post(`${this.$store.getters.apiPath}/players/search`,
                    {
                        inputSearch: this.inputSearch
                    }
                )
                .then((res) => {
                    this.$store.state.all_players = res.data
                })
                .catch((err) => {
                    console.log(err);
                }) 
        },
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
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                })

            this.editModal = false
            location.reload();
        }
    },
    created() {
        this.$http
            .get(`${this.$store.getters.apiPath}/players`)
            .then((res) => {
                this.$store.state.all_players = res.data
            })
            .catch((err) => {
                console.log(err);
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