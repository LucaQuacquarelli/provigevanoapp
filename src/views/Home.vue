<template>
    <div class="home-view">
        <div class="home-hero">
            <div class="hero-pitch">
                <div class="pitch-lines"></div>
                <div class="pitch-circle"></div>
            </div>
            <span class="hero-ball">⚽</span>
            <h1 class="hero-title">Pro<br>Vigevano</h1>
            <p class="hero-sub">Crea squadre equilibrate in pochi tap</p>
        </div>

        <div class="home-actions">
            <router-link to="/choose_players" class="btn-cta home-cta">
                <i class="fa-solid fa-futbol"></i>
                {{ $t('routes.start') }}
            </router-link>
            <router-link to="/players" class="btn-ghost home-ghost">
                <i class="fa-solid fa-users"></i>
                Gestisci Rosa
            </router-link>
        </div>
    </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.home-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 1rem;
    gap: 2.5rem;
}

.home-hero {
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3rem 1.5rem 2.5rem;
    border-radius: var(--r-lg);
    background: var(--bg-card);
    border: 1px solid var(--border-sm);
    overflow: hidden;
    text-align: center;
    gap: 0.75rem;
}

/* Decorative pitch background */
.hero-pitch {
    position: absolute;
    inset: 0;
    opacity: 0.04;
    pointer-events: none;
}

.pitch-lines {
    position: absolute;
    inset: 0;
    border: 2px solid white;
    margin: 1.5rem;
    border-radius: 4px;
}

.pitch-circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    border: 2px solid white;
    border-radius: 50%;
}

.hero-ball {
    font-size: 3rem;
    line-height: 1;
    animation: spin 12s linear infinite;
    filter: drop-shadow(0 0 16px rgba(30,215,96,0.4));
    z-index: 1;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
}

.hero-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 4rem;
    font-weight: 800;
    line-height: 0.95;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--t1);
    z-index: 1;
}

.hero-sub {
    font-size: 0.9rem;
    color: var(--t2);
    z-index: 1;
}

.home-actions {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    align-items: center;
}

.home-cta {
    width: 100%;
    padding: 1rem;
    font-size: 1.2rem;
}

.home-ghost {
    width: 100%;
    justify-content: center;
    padding: 0.85rem;
}
</style>
