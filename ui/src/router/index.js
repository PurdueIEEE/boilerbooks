import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
//import auth_state from '@/state'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/help',
    name: 'Help',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "help" */ '../views/Help.vue'),
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/myaccount',
    name: 'Account',
    component: () => import(/* webpackChunkName: "account" */ '../views/account/Account.vue'),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/myaccount/password',
    name: 'Password',
    component: () => import(/* webpackChunkName: "password" */ '../views/account/Password.vue'),
    meta: {
      requiresAuth: true,
    }
  }
]

const router = new VueRouter({
  routes,
  base: process.env.BASE_URL,
  mode: 'history',
});

// Make sure user is logged in before moving
router.beforeEach((to, from, next) => {
  //const requiresAuth = to.matched.some(x => x.meta.requiresAuth);

  /*if(requiresAuth && auth_state.state.id === '') {
    next('/login');
  } else {
    next();
  }*/
  next();
});

export default router
