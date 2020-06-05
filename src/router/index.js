import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import Overview from "@/views/Overview"

const routes = [
  { path: "/", name: "overview", component: Overview }
]

const router = new VueRouter({
  routes,
  mode: "history"
});

export default router;