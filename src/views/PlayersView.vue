<template>
    <h1>
        Players
    </h1>
</template>

<script>
export default {
    name: 'PlayerView',
    data() {
        return {
            api_protocol: this.$store.state.config.api_protocol,
            api_url: this.$store.state.config.api_url,
            api_port: this.$store.state.config.api_port
        }
    },
    methods: {
        update() {
            this.$http.get(`${this.api_protocol}${this.api_url}:${this.api_port}/update_player`)
            .then((res)=>{
                console.log(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
        }
    },
    created() {
        this.$http.get(`${this.api_protocol}${this.api_url}:${this.api_port}/players`)
        .then((res)=>{
            console.log(res.data)
        })
        .catch((err) => {
            console.log(err)
        })
    }
}
</script>

<style lang="scss" scoped>

</style>