import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { setupStore } from '@/store/index'
import naive from 'naive-ui'
import { router } from '@/router'


// 导入公共样式
import "./style/index.scss";

const app = createApp(App)

setupStore(app)

app.use(router)

app.use(naive)

app.mount('#app')
