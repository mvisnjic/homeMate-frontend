import { createRouter, createWebHistory } from "vue-router";
import index from "/src/views/index.vue";
const defaultTitle = "homeMate";

const routes = [
  {
    path: "/",
    name: "index",
    component: index,
    meta: { title: "Init - " + defaultTitle },
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { selector: to.hash };
    }
    return { x: 0, y: 0 };
  },
});

router.afterEach((to) => {
  document.title = to.meta.title || defaultTitle;
});
export default router;
