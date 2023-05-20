import { createApp } from 'vue'
import App from './App.vue'
import Axios from 'axios'
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
// import "@fontsource/spartan/400.css"
import i18n from './i18n'

const app = createApp(App)
app.config.globalProperties.$http = Axios

app.use(router)
app.use(store)
app.use(i18n)
app.mount('#app')
