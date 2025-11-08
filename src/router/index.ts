import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import TemplatesPage from '../pages/TemplatesPage.vue'
import EditorPage from '../pages/EditorPage.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', component: TemplatesPage },
  { path: '/editor/:id?', component: EditorPage }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})
