# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A soccer team balancing app that allows users to select players from a MySQL database, mark their availability, and generate balanced teams using a greedy algorithm with multiple random shuffle iterations. It's deployable as a mobile app via Capacitor (iOS/Android).

## Setup

1. Copy and configure `./config.json` (not committed — contains DB credentials and API URL/port settings)
2. `npm install`

The `config.json` is required by both the Vue frontend (`src/store/index.js`) and the Express API (`api/Config.js`, `vue.config.js`). It must define `api_protocol`, `api_url`, `api_port`, and `dbms` (Sequelize connection config).

## Commands

```bash
# Frontend dev server
npm run serve

# API server (run separately)
node ./api/start.js

# Production build
npm run build

# Lint
npm run lint

# DB migrations
npx sequelize-cli db:migrate --migrations-path ./api/database/migrations --url 'mysql://user:pass@host/db'

# DB seeders (all)
npx sequelize-cli db:seed:all --seeders-path ./api/database/seeders --url 'mysql://user:pass@host/db'

# Single seeder
npx sequelize-cli db:seed --seed 20251219100651-add-new-players --url 'mysql://user:pass@host/db'
```

## Architecture

### Frontend (Vue 3 + Vuex + Vue Router)

The app is a single-page Vue 3 app using the Composition API (`<script setup>`). State is managed via Vuex in `src/store/index.js`, which holds player lists, team configuration, and UI modal states.

**App flow (route order):**
1. `/` (Home) — entry point, shows `InsertList` component
2. `/choose_players` — mark player availability (available/unavailable), select goalkeepers
3. `/players` — full player list view with edit capability
4. `/selected_players` — review chosen players and pick a team configuration (number of teams × players per team)
5. `/teams` — final balanced teams display; redirects back to `/choose_players` if no data in store

**Team balancing algorithm** (`src/views/TeamsView.vue`): Runs 50 iterations of Fisher-Yates shuffle + greedy assignment (weakest team gets next player). Picks the configuration with the minimum score difference between teams.

**API calls**: Made via Axios configured as `$http` globally and also imported directly in the Vuex store. The API base URL is built from the store getter `apiPath`.

### Backend (Express + Sequelize)

Entry point: `api/start.js` → `api/app.js`

**Layer structure:**
- `api/Config.js` — singleton Sequelize connection factory
- `api/models/ModelBase.js` — initializes all models and sets up Sequelize associations (Player belongsTo Level, Role, Language)
- `api/controllers/ControllerBase.js` — extends `ModelBase.Player` with business-logic queries (available, unavailable, goalkeepers, provisory GK)
- `api/controllers/PlayersController.js` — Express route handlers that use both `ModelBase` and `ControllerBase`

**Player roles:** `role_id: 1` = field player, `role_id: 2` = goalkeeper. A player can also be flagged as `goalkeeper_provisory: true` to act as a temporary GK.

**Key API endpoints:**
- `GET /players/available_unavailable` — split player list by availability
- `POST /players_availability` — toggle player availability
- `GET /players/get_by_level` — players grouped by level (used for team generation)
- `POST /goalkeeper_provisory` — mark a player as provisional goalkeeper
- `GET /goalkeeper_provisory/clear` — reset all provisional GK flags

### Internationalization

All UI strings use `vue-i18n`. Translations live in `src/i18n/translations/it.json` (Italian only). Use `$t('key')` in templates and `useI18n()` in `<script setup>` components.

### Mobile (Capacitor)

The app wraps the Vue build with Capacitor for iOS and Android. iOS project is under `./ios/`. After `npm run build`, sync with `npx cap sync`.
