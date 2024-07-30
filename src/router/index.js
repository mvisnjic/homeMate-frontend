import { createRouter, createWebHistory } from "vue-router";
import index from "/src/views/index.vue";
import login from "/src/views/login.vue";
import home from "/src/views/home.vue";
import chat from "/src/views/chat.vue";
import { Auth } from "../services";
const defaultTitle = "homeMate";

const routes = [
  {
    path: "/",
    name: "index",
    component: index,
    meta: { title: "index - " + defaultTitle },
  },
  {
    path: "/login",
    name: "login",
    component: login,
    meta: { title: "login - " + defaultTitle },
  },
  {
    path: "/home",
    name: "home",
    component: home,
    meta: { title: "home - " + defaultTitle },
  },
  {
    path: "/chat",
    name: "chat",
    component: chat,
    meta: { title: "chat - " + defaultTitle },
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

router.beforeEach(async (to, from, next) => {
  const publicPages = ["/login", "/"];
  const authRequired = !publicPages.includes(to.path);
  const user = await Auth.getUser();

  if (authRequired && !user) {
    return next("/login");
  }
  next();
});
export default router;
