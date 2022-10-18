<template>
    <div class="card">
        <div class="card-header d-flex justify-content-between align-items-start position-relative p-3">
            <div class="round round-left p-4 rounded-circle bg-white"></div>
            <div class="round round-right p-4 rounded-circle bg-white"></div>
        </div>
        <div class="card-body d-flex flex-wrap p-0">
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
        <div class="card-footer p-3">

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
        border: 0 !important;

        .card-header {  
            background-color: #d8ad48 !important;
            border: 0 !important;
            overflow: hidden;
            border-radius: 150vh 150vh 0% 0%/40vh 40vh 0% 0%  !important;
            -moz-border-radius: 150vh 150vh 0% 0%/40vh 40vh 0% 0%  !important;
            -webkit-border-radius: 150vh 150vh 0% 0%/40vh 40vh 0% 0%  !important;

            .round {
                position: absolute;
            }

            .round-left {
                top: -85%;
                left: -15%;
            }
            .round-right {
                top: -85%;
                right: -15%;
            }
        }
        .card-footer {  
            background-color: #d8ad48 !important;
            border: 0 !important;
            overflow: hidden;
            border-radius: 0% 0% 150vh 210vh/0% 0% 40vh 40vh !important;
            -moz-border-radius: 0% 0% 150vh 210vh/0% 0% 40vh 40vh !important;
            -webkit-border-radius: 0% 0% 150vh 210vh/0% 0% 40vh 40vh !important;
 
            &:after {
                content: "";
                width: 20px;
                height: 20px;
                transform: rotate(-45deg); background-color: #d8ad48 !important;
                position: absolute;
                bottom: -10px;
                left: calc(50% - 10px);
            }
        }

        .card-body {
            background-color: #d8ad48 !important;
        }

        img {
            position: relative;
            top: 15%;
            left: 0;
            transform: scale(1.4);
        }
    }
</style>