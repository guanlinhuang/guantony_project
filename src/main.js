/* eslint-disable vue/multi-word-component-names */
import { createApp } from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

// 載入讀取視覺套件
import Loading from 'vue3-loading-overlay'
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(VueAxios, axios)
app.use(router)
app.component('Loading', Loading) // 全域註冊
app.mount('#app')

// 原寫法
// createApp(App).use(router).mount('#app')

// app.use 是用來安裝套件的
// app.component 是用來註冊元件的
