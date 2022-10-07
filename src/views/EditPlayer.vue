<template>
    <div>
        {{player}}
        <button @click="print">Print</button>
    </div>
</template>

<script>
export default {
    name: 'EditPlayer',
    props: {
        player: {
            type: Object,
        },
    },
    data() {
        return {
            // player: this.$route.query
        };
    },
    methods: {
        print() {
            // console.log(JSON.parse(this.$route.query.item));
            console.log(this.player);
        }
    },
};
</script>

<style>

</style>