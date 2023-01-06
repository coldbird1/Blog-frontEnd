import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'
import naive from 'naive-ui'
import { router } from '@/router'
import axios from 'axios'

// 导入公共样式
import "./style/index.scss";

axios.defaults.baseURL = "http://localhost:8080"

const app = createApp(App)

app.provide('axios', axios)

const pinia = createPinia()
pinia.use(piniaPluginPersist)
app.use(router)
app.use(pinia)

app.use(naive)

app.mount('#app')
