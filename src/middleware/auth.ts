import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

export function authGuard(
  to: RouteLocationNormalized,
  _: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const apiKey = localStorage.getItem("token");

  if (!apiKey && !["/login", "/register"].includes(to.path)) {
    return next("/login");
  }

  if (apiKey && to.matched.length === 0) {
    return next("/");
  }

  next();
}
