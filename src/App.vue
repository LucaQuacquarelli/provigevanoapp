<template>
    <nav class="nav justify-content-center  ">
        <router-link class="nav-link" to="/">
            Home
        </router-link>

        <router-link class="nav-link" to="/players">
            Players
        </router-link>

        <router-link class="nav-link" to="/choose_players">
            Start
        </router-link>
    </nav>
    <div class="container">
        <router-view />
    </div>
</template>

<script>
export default {
    name: 'ProVigevanoApp',
    data() {
        return {
            inputSearch: '',
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
                console.log(err);
            }) 
    }
};
</script>

<style lang="scss">
@import './style/general.scss';

#app {
    height: 100%;
}
</style>