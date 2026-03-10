<template>
    <div class="modal-backdrop" @click.self="$emit('close')">
        <div class="modal-panel">
            <slot name="header"></slot>
            <slot name="body"></slot>
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script>
export default { name: 'Modal' }
</script>

<style lang="scss" scoped>
.modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(5, 10, 18, 0.85);
    backdrop-filter: blur(8px);
    z-index: 200;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 1rem;
    overflow-y: auto;
    animation: fadeIn 0.2s ease;
}

.modal-panel {
    width: 100%;
    max-width: 520px;
    background: var(--bg-card);
    border: 1px solid var(--border-md);
    border-radius: var(--r-lg);
    overflow: hidden;
    animation: slideDown 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
}

@keyframes slideDown {
    from { transform: translateY(-20px) scale(0.97); opacity: 0; }
    to   { transform: translateY(0) scale(1); opacity: 1; }
}
</style>
