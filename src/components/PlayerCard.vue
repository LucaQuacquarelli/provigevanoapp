<template>
    <div class="pcard" :class="`lv-${player.level.id}`">
        <div class="pcard-stripe"></div>
        <div class="pcard-body">
            <div class="pcard-left">
                <span class="pcard-level mono">{{ player.level.percentage }}</span>
                <span class="role-tag" :class="roleTagClass(player)">
                    {{ roleAbbreviation(player) }}
                </span>
                <span class="pcard-flag">🇮🇹</span>
            </div>
            <div class="pcard-img-wrap">
                <img src="@/assets/img/player.svg" alt="player" class="pcard-img" />
            </div>
        </div>
        <div class="pcard-footer">
            <span class="pcard-nick">{{ player.nick_name }}</span>
            <span class="pcard-fullname">{{ player.name }} {{ player.surname }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PlayerCard',
    props: { player: Object },
    computed: {
        roleAbbreviation() {
            const abbr = { goalkeeper: 'PT', player: 'PL', difensore: 'DEF', centrocampo: 'CEN', attaccante: 'ATT' }
            return player => {
                if (player.role.name === 'goalkeeper') return 'PT'
                const firstTactical = player.roles && player.roles[0]
                if (firstTactical) return abbr[firstTactical.name] || 'PL'
                return 'PL'
            }
        },
        roleTagClass() {
            return player => {
                if (player.role.name === 'goalkeeper') return 'gk'
                const firstTactical = player.roles && player.roles[0]
                if (!firstTactical) return 'pl'
                const map = { difensore: 'def', centrocampo: 'mid', attaccante: 'att' }
                return map[firstTactical.name] || 'pl'
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.pcard {
    background: var(--bg-card);
    border: 1px solid var(--border-sm);
    border-radius: var(--r-md);
    overflow: hidden;
    cursor: pointer;
    transition: transform var(--t-fast), border-color var(--t-fast), box-shadow var(--t-fast);
    height: 100%;

    &:hover {
        transform: translateY(-2px);
        border-color: var(--border-md);
        box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    }

    &:active { transform: scale(0.97); }

    /* Level stripe at top */
    &.lv-1 .pcard-stripe { background: var(--lv1); }
    &.lv-2 .pcard-stripe { background: var(--lv2); }
    &.lv-3 .pcard-stripe { background: var(--lv3); }
    &.lv-4 .pcard-stripe { background: var(--lv4); }
    &.lv-5 .pcard-stripe { background: var(--lv5); }
}

.pcard-stripe {
    height: 3px;
    width: 100%;
}

.pcard-body {
    display: flex;
    align-items: flex-end;
    padding: 0.75rem 0.75rem 0;
    gap: 0.5rem;
    min-height: 90px;
    position: relative;
    overflow: hidden;
    background: var(--bg-elevated);
}

.pcard-left {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    z-index: 1;
    flex-shrink: 0;
}

.pcard-level {
    font-family: 'DM Mono', monospace;
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--t1);
}

.pcard-flag {
    font-size: 1rem;
}

.pcard-img-wrap {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    overflow: hidden;
}

.pcard-img {
    width: 75px;
    opacity: 0.85;
    transform: scale(1.15) translateY(4px);
    transform-origin: bottom center;
}

.pcard-footer {
    padding: 0.6rem 0.75rem 0.75rem;
    background: var(--bg-card);
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
}

.pcard-nick {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.05rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    color: var(--t1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.pcard-fullname {
    font-size: 0.75rem;
    color: var(--t2);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
