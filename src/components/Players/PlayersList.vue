<template>
    <div class="form-check">
        <div v-for="player,i in AllPlayers" :key="i">
            <input class="form-check-input" type="checkbox" />
            <label class="form-check-label" for="flexCheckDefault">
                <span>{{ player.name }}</span> - <span class="badge bg-secondary">{{ player.nick_name }}</span>
            </label>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PlayersList',
    props: {
        AllPlayers: {
            type: Array,
        },
    },
    data() {
        return {
        };
    },
    methods: {
    },
};
</script>

<style>

</style>