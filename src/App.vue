<template>
    <router-link to="/">
        home
    </router-link>
    <router-link to="/players">
        players
    </router-link>
    <router-view/>
</template>

<script>
export default {
    name: 'ProVigevanoApp'
}
</script>

<style lang="scss">
@import './style/general.scss';

    #app {
        height: 100%;
    }
</style>