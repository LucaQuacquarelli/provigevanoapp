<template>
    <footer class="app-footer">
        <nav class="footer-nav">
            <router-link class="nav-tab" to="/" exact-active-class="active">
                <i class="fa-solid fa-house nav-icon"></i>
                <span class="nav-label">Home</span>
            </router-link>
            <router-link class="nav-tab" to="/choose_players" active-class="active">
                <span class="nav-icon ball-icon">⚽</span>
                <span class="nav-label">Giocatori</span>
            </router-link>
            <router-link class="nav-tab" to="/players" active-class="active">
                <i class="fa-solid fa-users nav-icon"></i>
                <span class="nav-label">Rosa</span>
            </router-link>
        </nav>
    </footer>
</template>

<script>
export default { name: 'Footer' }
</script>

<style lang="scss" scoped>
.app-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: var(--footer-h);
    background: rgba(5, 10, 18, 0.92);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-top: 1px solid var(--border-sm);
    z-index: 100;
}

.footer-nav {
    max-width: 600px;
    margin: 0 auto;
    height: 100%;
    display: flex;
    align-items: center;
}

.nav-tab {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
    text-decoration: none;
    color: var(--t3);
    transition: color var(--t-fast);
    padding: 0.5rem 0;
    position: relative;

    &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 50%;
        transform: translateX(-50%) scaleX(0);
        width: 20px;
        height: 2px;
        background: var(--green);
        border-radius: 2px;
        transition: transform var(--t-med);
    }

    &.active {
        color: var(--green);

        &::after {
            transform: translateX(-50%) scaleX(1);
        }
    }
}

.nav-icon {
    font-size: 1.2rem;
    line-height: 1;
}

.ball-icon {
    font-size: 1.2rem;
}

.nav-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
}
</style>
