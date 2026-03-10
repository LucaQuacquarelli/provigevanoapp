<template>
    <header class="app-header">
        <div class="header-inner">
            <span class="app-logo">⚽</span>
            <span class="app-name">Pro Vigevano</span>
        </div>
    </header>
</template>

<script>
export default { name: 'Header' }
</script>

<style lang="scss" scoped>
.app-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: var(--header-h);
    background: rgba(5, 10, 18, 0.88);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border-xs);
    z-index: 100;
}

.header-inner {
    max-width: 600px;
    margin: 0 auto;
    height: 100%;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0 1.25rem;
}

.app-logo {
    font-size: 1.35rem;
    line-height: 1;
}

.app-name {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.35rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--t1);
}
</style>
