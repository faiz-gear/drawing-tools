/*
 * @Author       : 卢瑶
 * @Date         : 2022-03-17 16:52:34
 * @LastEditTime : 2022-03-26 23:49:20
 * @LastEditors  : 卢瑶
 * @Description  : 路由出口文件
 * @FilePath     : /drawing-tool/src/router/index.ts
 */

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "Login" */ '@/views/home/Home.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
