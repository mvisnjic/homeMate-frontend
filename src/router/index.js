import { createRouter, createWebHistory } from "vue-router";
import index from "/src/views/index.vue";
import login from "/src/views/login.vue";
import chat from "/src/views/chat.vue";
import about from "/src/views/about.vue";
import settings from "/src/views/settings.vue";
import myprofile from "/src/views/myprofile.vue";
import notfound from "/src/views/notfound.vue";
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
    path: "/chat/:chat_id",
    component: chat,
    name: "dynamic-chat",
    props: true,
    meta: { title: "chat - " + defaultTitle },
  },
  {
    path: "/chat",
    name: "chat",
    component: chat,
    meta: { title: "chat - " + defaultTitle },
  },
  {
    path: "/about",
    name: "about",
    component: about,
    meta: { title: "about - " + defaultTitle },
  },
  // {
  //   path: "/settings",
  //   name: "settings",
  //   component: settings,
  //   meta: { title: "settings - " + defaultTitle },
  // },
  // {
  //   path: "/my-profile",
  //   name: "myprofile",
  //   component: myprofile,
  //   meta: { title: "my-profile - " + defaultTitle },
  // },
  {
    path: '/:pathMatch(.*)*',
    name: 'notfound',
    component: notfound,
    meta: { title: "404 oops - " + defaultTitle },
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
  const publicPages = ["/login", "/", "/about"];
  const authRequired = !publicPages.includes(to.path);
  const user = await Auth.getUser();

  if (authRequired && !user) {
    return next("/login");
  }
  next();
});
export default router;
