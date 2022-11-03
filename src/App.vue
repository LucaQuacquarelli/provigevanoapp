<template>
    <Header/>
    <div class="container py-4">
        <router-view />
    </div>
    <Footer/>
    <transition name="fade-modal">
        <modal v-if="this.$store.state.serverModal" @close="this.$store.state.serverModal = false">
            <template v-slot:header>
                <div class="modal-header bg-danger border-0 rounded-0 text-light py-2 px-4">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-globe me-2"></i>
                        <h5 class="modal-title">
                            {{ this.$store.state.errServer }}
                        </h5>
                    </div>
                    <div class="d-flex align-items-center" @click="this.$router.go(`${this.$route.path}`)">
                        <i class="fas fa-rotate fs-4 cursor-pointer"></i>
                    </div>
                </div>
            </template>
        </modal>
    </transition>

    <transition name="fade-modal">
        <modal v-if="this.$store.state.successModal" @close="this.$store.state.successModal = false">
            <template v-slot:header>
                <div class="modal-header bg-success border-0 rounded-0 text-light py-2 px-4">
                    <div class="d-flex align-items-center">
                        <i class="fa-solid fa-user-pen me-2"></i>
                        <h5 class="modal-title">
                            {{ this.$store.state.successHeader }}
                        </h5>
                    </div>
                </div>
            </template>
        </modal>
    </transition>
</template>

<script>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import Modal from './components/Modal.vue';
export default {
    name: 'ProVigevanoApp',
    components: {
        Header,
        Footer,
        Modal
    },
    data() {
        return {
            editModal: false
        }
    },
    created() {
        this.$http
            .get(`${this.$store.getters.apiPath}/levels`)
            .then((res) => {
                this.$store.state.levels = res.data
            })
            .catch((err) => {
                this.$store.state.serverModal = true
                this.$store.state.errServer = err.message
            }) 
    }
};
</script>

<style lang="scss">
@import './style/general.scss';

.container {
    height: calc(100vh - 120px);
    margin-top: 60px;
    overflow-y: auto;
}
</style>