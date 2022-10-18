<template>
    <div class="my-modal-backdrop d-flex justify-content-center align-items-start" @click.self="$emit('close')">
        <div class="my-modal col-12 col-md-6 col-xxl-5 rounded py-2 px-4">

            <slot name="header">
            </slot>

            <slot name="body">
            </slot>
            
            <slot name="footer">   
            </slot>
        </div>
    </div>
    
</template>

<script>
export default {
    name : 'Modal'
}
</script>

<style lang="scss" scoped>
.my-modal-backdrop {
    position: fixed;
    padding: 10px;
    inset: 0;
    background-color: rgba(black, 0.7);
    z-index: 99;  
    overflow-y: auto;
    
    .my-modal {
        position: relative;
        background-color: white;
        overflow-y: auto;
        animation-name: modal;
        animation-duration: .3s;

        @keyframes modal {
            0%   {bottom:50%; top:50%;}
            100% {bottom:0px; top:0px;}
        }
        
    }
}

</style>