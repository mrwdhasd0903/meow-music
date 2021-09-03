import { createApp } from 'vue'
import App from './App.vue'
import Svg from "@/components/Svg/index.vue"
import "./style/index.scss"

createApp(App).component('Svg', Svg).mount('#app')
