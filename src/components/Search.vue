<template>
    <div class="search-wrap">
        <i class="fa-solid fa-magnifying-glass search-icon"></i>
        <input
            type="text"
            class="search-input"
            :placeholder="$t('general.search')"
            v-model="this.$store.state.inputSearch"
            @keyup="this.$store.dispatch('searchPlayers', playersFiltered)"
        />
        <button v-if="this.$store.state.inputSearch.length > 0" class="search-clear" @click="clear">
            <i class="fa-solid fa-xmark"></i>
        </button>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
    name: 'Search',
    props: { playersFiltered: Boolean },
    computed: {
        ...mapState(['inputSearch'])
    },
    methods: {
        ...mapMutations(['resetInputSearch']),
        clear() {
            this.resetInputSearch()
            this.$store.dispatch('searchPlayers', this.playersFiltered)
        }
    }
}
</script>

<style lang="scss" scoped>
.search-wrap {
    position: relative;
    display: flex;
    align-items: center;
}

.search-icon {
    position: absolute;
    left: 1rem;
    color: var(--t3);
    font-size: 0.85rem;
    pointer-events: none;
    z-index: 1;
}

.search-input {
    width: 100%;
    padding: 0.75rem 2.8rem;
    background: var(--bg-elevated);
    border: 1px solid var(--border-sm);
    border-radius: var(--r-pill);
    color: var(--t1);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    outline: none;
    transition: border-color var(--t-fast), box-shadow var(--t-fast);

    &::placeholder {
        color: var(--t3);
    }

    &:focus {
        border-color: var(--green);
        box-shadow: 0 0 0 3px var(--green-muted);
    }
}

.search-clear {
    position: absolute;
    right: 0.85rem;
    background: var(--bg-hover);
    border: none;
    color: var(--t2);
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    cursor: pointer;
    transition: background var(--t-fast), color var(--t-fast);

    &:hover {
        background: var(--border-md);
        color: var(--t1);
    }
}
</style>
