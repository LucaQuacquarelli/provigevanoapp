<template>
    <ul class="nav justify-content-center  ">
        <router-link class="nav-item" to="/">
            <a class="nav-link" aria-current="page">Home</a>
        </router-link>

        <router-link class="nav-item" to="players">
            <a class="nav-link" aria-current="page">Players</a>
        </router-link>
    </ul>
    <div class="container">
        <router-view />
    </div>
</template>

<script>
export default {
    name: 'ProVigevanoApp'
};
</script>

<style lang="scss">
@import './style/general.scss';

#app {
    height: 100%;
}
</style>