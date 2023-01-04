import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'
import naive from 'naive-ui'
import { router } from '@/router'
import axios from 'axios'

axios.defaults.baseURL = "http://localhost:8080"

const app = createApp(App)

app.provide('axios', axios)

const pinia = createPinia()
pinia.use(piniaPluginPersist)
app.use(pinia)

app.use(naive)
app.use(router)
app.mount('#app')
