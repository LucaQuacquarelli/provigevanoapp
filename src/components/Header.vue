<template>
    <header class="d-flex py-2 px-4 mb-4">
        <div class="col-12 d-flex align-items-center">
            <div class="col-2">
                <span class="fs-1" @click="setAside">
                    <i class="fa-solid fa-bars"></i>
                </span>
            </div>
            <div class="col-8 text-center">
                <h1>
                    Pr⚽ Vigevan⚽
                </h1>
            </div>
        </div>
    </header>
</template>

<script>
export default {
    name: 'Header',
    methods: {
        setAside() {
            this.$store.commit('setAside')
        }
    }
}
</script>

<style lang="scss" scoped>
header {
    box-shadow: 0 0 15px 10px black;
    background-image: url('../assets/img/soccer-bg.jpg');
    h1 {
        color: white;
        text-shadow: -2px 0 black, 0 2px black, 2px 0 black, 0 -2px black;
    }

    i {
        text-shadow: -2px 0 white, 0 2px white, 2px 0 white, 0 -2px white;
        box-shadow: 0 0 15px 5px green;
    }
}
</style>