<template>
    <aside class="offcanvas offcanvas-start" id="aside">
        <div class="offcanvas-header text-center">
            <h1>
                Pr⚽ Vigevan⚽
            </h1>
        </div>
        <div class="offcanvas-body d-flex flex-wrap p-0 flex-grow-0">
            <div class="col-12 p-4 aside-link" data-bs-dismiss="offcanvas">
                <router-link class="nav-link" to="/" >
                    {{ $t("routes.home")}}
                </router-link>
            </div>
            <div class="col-12 p-4 aside-link" data-bs-dismiss="offcanvas">
                <router-link class="nav-link" to="/players">
                    {{ $t("routes.players")}}
                </router-link>
            </div>
            <div class="col-12 p-4 aside-link" data-bs-dismiss="offcanvas">
                <router-link class="nav-link" to="/choose_players">
                    {{ $t("routes.start")}}
                </router-link>
            </div>
        </div>
    </aside>
</template>

<script>
export default {
    name: 'Aside',
    computed: {
        asideStatus() {
            return this.$store.state.asideStatus
        }
    },
    methods: {
        setAside() {
            this.$store.commit('setAside')
        }
    }

}
</script>

<style lang="scss" scoped>

    aside {
    background-image: url('../assets/img/erba-campo.jpg');
    background-size: cover;
    background-position: center;
    box-shadow: 0 0 15px 5px black;
    
    &.offcanvas.offcanvas-start {
        max-width: 250px !important;
    }

    h1 {
        color: white;
        text-shadow: -2px 0 black, 0 2px black, 2px 0 black, 0 -2px black;
    }

    .aside-link {
        border-bottom: 5px solid white !important;
        font-size: 24px;
        color: white;

        &:last-child {
            border-bottom: 0px solid white !important;
        }
    }
}
</style>