<template>
    <div class="slide-backdrop" @click.self="$emit('close')">
        <div class="slide-panel">
            <div class="slide-handle"></div>
            <slot name="header"></slot>
            <slot name="body"></slot>
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script>
export default { name: 'ModalSlide' }
</script>

<style lang="scss" scoped>
.slide-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(5, 10, 18, 0.8);
    backdrop-filter: blur(8px);
    z-index: 200;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    animation: fadeIn 0.2s ease;
}

.slide-panel {
    width: 100%;
    max-width: 600px;
    background: var(--bg-card);
    border: 1px solid var(--border-md);
    border-bottom: none;
    border-radius: var(--r-lg) var(--r-lg) 0 0;
    overflow: hidden;
    max-height: 92vh;
    overflow-y: auto;
    animation: slideUp 0.3s cubic-bezier(0.34, 1.2, 0.64, 1);
}

.slide-handle {
    width: 36px;
    height: 4px;
    background: var(--border-md);
    border-radius: 2px;
    margin: 0.75rem auto 0;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
}

@keyframes slideUp {
    from { transform: translateY(40px); opacity: 0; }
    to   { transform: translateY(0); opacity: 1; }
}
</style>
