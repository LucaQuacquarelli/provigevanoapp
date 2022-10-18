<template>
    <div class="card">
        <div class="card-header p-3 bg-info">

        </div>
        <div class="card-body d-flex flex-wrap px-0">
            <div class="col-4 text-center">
                <h2 class="fw-bold">
                    {{ level.percentage }}
                </h2>
                <h2>
                    PL
                </h2>
                <h2>
                    🇮🇹
                </h2>
            </div>
            <div class="col-8 text-end overflow-hidden">
                <img src="@/assets/img/player.svg" class="w-100">
            </div>
            <div class="col-12 text-center my-2">
                <h4 class="font-monospace fw-bold">
                    {{ player.nick_name }}
                </h4>
            </div>
            <div class="col-12 text-center">
                <span>
                    {{ player.name }}
                </span>
            </div>
            <div class="col-12 text-center">
                <span>
                    {{ player.surname }}
                </span>
            </div>
        </div>
        <div class="card-footer bg-info">

        </div>
    </div>
</template>

<script>
export default {
    name: 'PlayerCard',
    props: {
        level: Object,
        player: Object
    }
}
</script>

<style lang="scss" scoped>
    .card{
    
        img {
            position: relative;
            top: 15%;
            left: 0;
            transform: scale(1.4);
        }
    }
</style>