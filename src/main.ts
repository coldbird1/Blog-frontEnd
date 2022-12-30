import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import naive from 'naive-ui'
import { router } from './common/router'
import axios from 'axios'
// import Storage from 'vue-ls';

// const options = {
//   namespace: 'ikun__', // 存储的key键前缀,可自定义
//   name: 'ls', // 命名Vue变量.ls则使用为this.$ls或者Vue.ls,
//   storage: 'local', // 存储名称: session, local, memory，更改为session则默认存储在sessionStorage
// };
// app.use(Storage, options);//使用vue-ls插件


axios.defaults.baseURL = "http://localhost:8080"

const app = createApp(App)

app.provide('axios', axios)

app.use(createPinia())
app.use(naive)
app.use(router)
app.mount('#app')
