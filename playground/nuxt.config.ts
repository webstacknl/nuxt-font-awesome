import { defineNuxtConfig } from 'nuxt3'
import NuxtFontAwesome from '..'

export default defineNuxtConfig({
  modules: [
    NuxtFontAwesome
  ],
  fontawesome: {
    component: 'fa',
    imports: [
      {
        set: '@fortawesome/free-solid-svg-icons',
        icons: ['faCheckCircle']
      }
    ]
  }
})
