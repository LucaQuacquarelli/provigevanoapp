<template>
    <header class="d-flex py-2 px-4">
        <div class="col-12 d-flex align-items-center">
            <div class="col-2">
                <span class="fs-1" data-bs-toggle="offcanvas" data-bs-target="#aside">
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
    <Aside/>
</template>

<script>
import Aside from './Aside.vue'
export default {
    name: 'Header',
    components: {
        Aside
    }
}

</script>

<style lang="scss" scoped>
header {
    box-shadow: 0 0 15px 10px black;
    background-image: url('../assets/img/soccer-bg.jpg');
    background-size: cover;
    
    h1 {
        color: white;
        text-shadow: -2px 0 black, 0 2px black, 2px 0 black, 0 -2px black;
    }

    i {
        text-shadow: -2px 0 white, 0 2px white, 2px 0 white, 0 -2px white;
        box-shadow: 0 0 15px 5px green;
    }
}

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