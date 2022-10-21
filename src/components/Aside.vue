<template>
    <div class="backdrop" :class="asideStatus ? 'open' : 'close'" @click.self="setAside">    
        <aside>
            <div class="d-flex flex-wrap">
                <div class="col-12 p-4">
                    <h1>
                        Pr⚽ Vigevan⚽
                    </h1>
                </div>
                <div class="col-12 p-4 aside-link">
                    <router-link @click="setAside" class="nav-link" to="/">
                        {{ $t("routes.home")}}
                    </router-link>
                </div>
                <div class="col-12 p-4 aside-link">
                    <router-link @click="setAside" class="nav-link" to="/players">
                        {{ $t("routes.players")}}
                    </router-link>
                </div>
                <div class="col-12 p-4 aside-link">
                    <router-link @click="setAside" class="nav-link" to="/choose_players">
                        {{ $t("routes.start")}}
                    </router-link>
                </div>
            </div>
        </aside>
    </div>
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

    .backdrop {
        position: fixed;
        inset: 0;
        background-color: rgba(black, 0.5);
        z-index: 99;  
        overflow-y: auto;

        &.open {
            position: absolute;
            animation: open 0.3s linear;

            @keyframes open {
                from {
                    left: -200px;
                }
                to {
                    left: 0;
                }
            }
        }
        &.close {
            position: absolute;
            animation: close 0.3s linear;

            @keyframes close {
                from {
                    left: 0;
                }
                to {
                    left: -200px;
                }
            }
        }

        aside{
            max-width: 250px;
            height: 100%;
            background-image: url('../assets/img/erba-campo.jpg');
            background-size: cover;
            background-position: center;
            box-shadow: 0 0 15px 5px black;
            transition: 0.3s;

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
    }
</style>