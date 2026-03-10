<template>
    <Header />
    <main class="page-content">
        <router-view />
    </main>
    <Footer />

    <transition name="fade-modal">
        <modal v-if="this.$store.state.serverModal" @close="this.$store.state.serverModal = false">
            <template v-slot:header>
                <div class="dark-modal-header error">
                    <div class="dark-modal-header-left">
                        <i class="fas fa-globe"></i>
                        <span>{{ this.$store.state.errServer }}</span>
                    </div>
                    <button class="modal-icon-btn" @click="this.$router.go(this.$route.path)">
                        <i class="fas fa-rotate"></i>
                    </button>
                </div>
            </template>
        </modal>
    </transition>

    <transition name="fade-modal">
        <modal v-if="this.$store.state.successModal" @close="this.$store.state.successModal = false">
            <template v-slot:header>
                <div class="dark-modal-header success">
                    <div class="dark-modal-header-left">
                        <i class="fa-solid fa-circle-check"></i>
                        <span>{{ this.$store.state.successHeader }}</span>
                    </div>
                </div>
            </template>
        </modal>
    </transition>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import Modal from './components/Modal.vue'
export default {
    name: 'ProVigevanoApp',
    components: { Header, Footer, Modal },
    created() {
        this.$http
            .get(`${this.$store.getters.apiPath}/levels`)
            .then((res) => { this.$store.state.levels = res.data })
            .catch((err) => {
                this.$store.state.serverModal = true
                this.$store.state.errServer = err.message
            })
    }
}
</script>

<style lang="scss">
@import './style/general.scss';

.page-content {
    max-width: 600px;
    margin: 0 auto;
    padding: calc(var(--header-h) + 1.25rem) 1.25rem calc(var(--footer-h) + 1.25rem);
    min-height: 100vh;
}

/* Modal header variants */
.dark-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.25rem;

    &.error   { border-top: 3px solid var(--lv1); }
    &.success { border-top: 3px solid var(--green); }

    .dark-modal-header-left {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        font-weight: 500;
        font-size: 0.95rem;
    }

    i {
        font-size: 1rem;
        color: var(--t2);
    }
}

.modal-icon-btn {
    background: var(--bg-elevated);
    border: 1px solid var(--border-md);
    color: var(--t2);
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background var(--t-fast), color var(--t-fast);

    &:hover { background: var(--bg-hover); color: var(--t1); }
}
</style>
