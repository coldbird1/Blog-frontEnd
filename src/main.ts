import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { setupStore } from '@/store/index'
import piniaPluginPersist from 'pinia-plugin-persist'
import naive from 'naive-ui'
import { router } from '@/router'
import axios from 'axios'

// 导入公共样式
import "./style/index.scss";

axios.defaults.baseURL = "http://localhost:8080"
const app     = createApp(App)

setupStore(app)

app.use(router)

app.use(naive)

app.mount('#app')
