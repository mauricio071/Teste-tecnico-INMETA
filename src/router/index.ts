import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/Home/index.vue";
import Login from "@/pages/Login/index.vue";
import Register from "@/pages/Register/index.vue";
import MyCards from "@/pages/MyCards/index.vue";
import CreateTrade from "@/pages/CreateTrade/index.vue";
import TradesPage from "@/pages/TradesPage/index.vue";
import { authGuard } from "@/middleware/auth.ts";

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  {
    path: "/my-cards",
    component: MyCards,
    meta: { requiresAuth: true },
  },
  {
    path: "/create-trade",
    component: CreateTrade,
    meta: { requiresAuth: true },
  },
  {
    path: "/trades",
    component: TradesPage,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(authGuard);

export default router;
