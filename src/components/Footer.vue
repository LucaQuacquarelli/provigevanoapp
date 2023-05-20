<template>
    <footer class="d-flex py-2 px-4">
        <div class="col-12 d-flex align-items-center">
            <div class="col-4 text-center text-white">
                <router-link class="nav-link" to="/">
                    <i class="fa-solid fa-house"></i>
                </router-link>
            </div>
            <div class="col-4 text-center text-white">
                <router-link class="nav-link" to="/choose_players">
                    ⚽
                </router-link>
            </div>
            <div class="col-4 text-center text-white">
                <router-link class="nav-link" to="/players">
                    <i class="fa-solid fa-people-group"></i>
                </router-link>
            </div>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'Footer'
}

</script>

<style lang="scss" scoped>
footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60px;
    border-radius: 25px 25px 0 0;
    z-index: 999;
    box-shadow: 0 0 15px 5px black, inset 0 4px 15px 5px black;
    background-image: url('../assets/img/erba-campo.jpg');
    background-size: cover;
    background-position: center;

    a {
        text-shadow: -2px 0 black, 0 2px black, 2px 0 black, 0 -2px black;
        font-size: 30px;
    }
}
</style>