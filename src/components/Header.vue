<template>
    <header class="d-flex py-2 px-4">
        <div class="col-12 text-center">
            <h1>
                Pr⚽ Vigevan⚽
            </h1>
        </div>
    </header>
</template>

<script>
export default {
    name: 'Header'
}

</script>

<style lang="scss" scoped>
header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    border-radius: 0 0 25px 25px;
    z-index: 999;
    box-shadow: 0 0 15px 5px black, inset 0 -4px 15px 5px black;
    background-image: url('../assets/img/soccer-bg.jpg');
    background-size: cover;
    
    h1 {
        font-size: 35px;
        color: white;
        text-shadow: -2px 0 black, 0 2px black, 2px 0 black, 0 -2px black;
    }
}
</style>