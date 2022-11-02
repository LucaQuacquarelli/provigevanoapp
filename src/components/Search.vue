<template>
    <div class="position-relative w-100">
        <input type="text" class="pro-searchbar" :placeholder="$t('general.search')" v-model="this.$store.state.inputSearch" @keyup="this.$store.dispatch('searchPlayers', playersFiltered)">
        <i class="fa-solid fa-xmark fs-2 text-danger" v-if="this.$store.state.inputSearch.length > 0" @click="clear"></i>
    </div>
</template>

<script>
import $ from 'jquery'
export default {
    name: 'Search',
    props: {
        playersFiltered: Boolean
    },
    methods: {
        clear() {
            $('.pro-searchbar').blur()
            this.$store.state.inputSearch = ''
            this.$store.dispatch('searchPlayers', this.playersFiltered)
        }
    }
}
</script>

<style lang="scss" scoped>

div {
    .pro-searchbar {
        width: 100%;
        padding: 10px;
        border: 0;
        border-bottom: 5px solid lightgray;
        outline: none;
        caret-color: transparent;
        
        &:focus {
            border-bottom: 5px solid green;
            animation: flashlight 1s infinite;
        }
    
        @keyframes flashlight {
            0% {border-bottom: 5px solid lightgray;};
            50% {border-bottom: 5px solid green;};
            100% {border-bottom: 5px solid lightgray;};
        }
    }

    i {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
    }
}

</style>