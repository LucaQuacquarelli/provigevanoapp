<template>
    <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 border-top bg-dark fixed-bottom">
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

<style lang="scss" scoped></style>