/*
  Copyright 2022 Purdue IEEE and Hadi Ahmed

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/


import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import auth_state from '@/state'

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
    path: '/forgot',
    name: 'Forgot',
    component: () => import(/* webpackChunkName: "forgot" */ '../views/Forgot.vue'),
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/passwordreset',
    name: 'PasswordReset',
    component: () => import(/* webpackChunkName: "passwordreset" */ '../views/PasswordReset.vue'),
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/detail-view',
    name: 'DetailView',
    component: () => import(/* webpackChunkName: "detailview" */ '../views/DetailView.vue'),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/user-view',
    name: 'UserView',
    component: () => import(/* webpackChunkName: "userview" */ '../views/UserView.vue'),
    meta: {
      requiresAuth: true,
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
  },
  {
    path: '/purchase',
    component: () => import(/* webpackChunkName: "purchase" */ '../views/purchase/Purchase.vue'),
    children: [
      {
        path:'/',
        component: () => import(/* webpackChunkName: "purchase_home" */ '../views/purchase/PurchaseHome.vue'),
      },
      {
        path:'new',
        component: () => import(/* webpackChunkName: "purchase_new" */ '../views/purchase/PurchaseNew.vue'),
      },
      {
        path:'approve',
        component: () => import(/* webpackChunkName: "purchase_approve" */ '../views/purchase/PurchaseApprove.vue'),
      },
      {
        path:'complete',
        component: () => import(/* webpackChunkName: "purchase_complete" */ '../views/purchase/PurchaseComplete.vue'),
      },
      {
        path: 'reimburse',
        component: () => import(/* webpackChunkName: "purchase_reimburse" */ '../views/purchase/PurchaseReimburse.vue'),
      },
      {
        path:'view',
        component: () => import(/* webpackChunkName: "purchase_view" */ '../views/purchase/PurchaseView.vue'),
      }
    ],
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/income',
    component: () => import(/* webpackChunkName: "income" */ '../views/income/Income.vue'),
    children: [
      {
        path: '/',
        component: () => import(/* webpackChunkName: "income_home" */ '../views/income/IncomeHome.vue'),
      },
      {
        path: 'modify',
        component: () => import(/* webpackChunkName: "income_modify" */ '../views/income/IncomeModify.vue'),
      }
    ],
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/financials',
    component: () => import(/* webpackChunkName: "financials" */ '../views/financials/Financials.vue'),
    children: [
      {
        path: '/',
        component: () => import(/* webpackChunkName: "financials_home" */ '../views/financials/FinancialsHome.vue'),
      },
      {
        path: 'committee',
        component: () => import(/* webpackChunkName: "financials_committee" */ '../views/financials/FinancialsCommittee.vue'),
      }
    ],
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/budget',
    component: () => import(/* webpackChunkName: "budget" */ '../views/budget/Budget.vue'),
    children: [
      {
        path: '/',
        component: () => import(/* webpackChunkName: "budget_home" */ '../views/budget/BudgetHome.vue'),
      },
      {
        path: 'modify',
        component: () => import(/* webpackChunkName: "budget_modify" */ '../views/budget/BudgetModify.vue'),
      },
      {
        path: 'approve',
        component: () => import(/* webpackChunkName: "budget_approve" */ '../views/budget/BudgetApprove.vue'),
      },
    ],
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/access',
    component: () => import(/* webpackChunkName: "access" */ '../views/access/Access.vue'),
    children: [
      {
        path: '/',
        component: () => import(/* webpackChunkName: "access_home" */ '../views/access/AccessHome.vue'),
      },
      {
        path: 'treasurers',
        component: () => import(/* webpackChunkName: "access_treasurers" */ '../views/access/AccessTreasurers.vue'),
      },
      {
        path: 'officers',
        component: () => import(/* webpackChunkName: "access_officers" */ '../views/access/AccessOfficers.vue'),
      },
      {
        path: 'internal',
        component: () => import(/* webpackChunkName: "access_internal" */ '../views/access/AccessInternal.vue'),
      },
    ],
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '*',
    component: () => import(/* webpackChunkName: "notfound" */ '../views/NotFound.vue'),
    meta: {
      requiresAuth: false,
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
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);

  if (!requiresAuth) { // does not need auth
    next();
  } else if (requiresAuth && auth_state.state.uname !== '') { // needs auth and auth set
    next();
  } else { // check if cookie exists
    let user = null;

    if (document.cookie.split(';').some((item) => item.trim().startsWith('apikey='))) {
      user = JSON.parse(localStorage.getItem('authState'));
    }

    if (user !== null) { // found valid old login
      auth_state.setAuthState(user);
      next();
    } else { // need to login
      next(`/login?returnto=${to.fullPath}`);
    }
  }
});

export default router
