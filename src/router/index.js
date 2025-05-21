import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/country',
    name: 'country',
    component: () => import('../views/CountryView.vue')
  },
  {
    path: '/agreement',
    name: 'agreement',
    component: () => import('../views/AgtView.vue')
  },
  {
    path: '/topic',
    name: 'topic',
    component: () => import('../views/TopicView.vue')
  },
  {
    path: '/subCategoryList',
    name: 'subCategoryList',
    component: () => import('../views/subCategoryView.vue')
  },
  {
    path: '/timeline',
    name: 'timeline',
    component: () => import('../views/timelineView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
