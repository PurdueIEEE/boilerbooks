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

import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/BoilerBooksHome.vue'
import NotFound from '../views/NotFound.vue'
import auth_state from '@/state'

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
    // this generates a separate chunk (<name>.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/BoilerBooksHelp.vue'),
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginSignup.vue'),
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/forgot',
    name: 'Forgot',
    component: () => import('../views/ForgotUserPass.vue'),
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/passwordreset',
    name: 'PasswordReset',
    component: () => import('../views/PasswordReset.vue'),
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/detail-view',
    name: 'DetailView',
    component: () => import('../views/DetailView.vue'),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/user-view',
    name: 'UserView',
    component: () => import('../views/UserView.vue'),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/income-view',
    name: 'IncomeView',
    component: () => import('../views/IncomeView.vue'),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/myaccount',
    name: 'Account',
    component: () => import('../views/account/AccountSettings.vue'),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/myaccount/password',
    name: 'Password',
    component: () => import('../views/account/ChangePassword.vue'),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/purchase',
    component: () => import('../views/purchase/PurchaseFrame.vue'),
    children: [
      {
        path:'',
        component: () => import('../views/purchase/PurchaseHome.vue'),
      },
      {
        path:'new',
        component: () => import('../views/purchase/PurchaseNew.vue'),
      },
      {
        path:'approve',
        component: () => import('../views/purchase/PurchaseApprove.vue'),
      },
      {
        path:'complete',
        component: () => import('../views/purchase/PurchaseComplete.vue'),
      },
      {
        path: 'reimburse',
        component: () => import('../views/purchase/PurchaseReimburse.vue'),
      },
      {
        path: 'checks',
        component: () => import('../views/purchase/PurchaseChecks.vue'),
      },
      {
        path:'view',
        component: () => import('../views/purchase/PurchaseView.vue'),
      },
      {
        path: 'reimbursements',
        component: () => import('../views/purchase/PurchaseReimbursements.vue'),
      },
      {
        path: ':pathMatch(.*)',
        component: NotFound
      }
    ],
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/income',
    component: () => import('../views/income/IncomeFrame.vue'),
    children: [
      {
        path: '',
        component: () => import('../views/income/IncomeHome.vue'),
      },
      {
        path: 'report',
        component: () => import('../views/income/IncomeReport.vue'),
      },
      {
        path: 'donation',
        component: () => import('../views/income/IncomeDonation.vue'),
      },
      {
        path: 'modify',
        component: () => import('../views/income/IncomeModify.vue'),
      },
      {
        path: ':pathMatch(.*)',
        component: NotFound
      }
    ],
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/financials',
    component: () => import('../views/financials/FinancialsFrame.vue'),
    children: [
      {
        path: '',
        component: () => import('../views/financials/FinancialsHome.vue'),
      },
      {
        path: 'committee',
        component: () => import('../views/financials/FinancialsCommittee.vue'),
      },
      {
        path: 'export',
        component: () => import('../views/financials/FinancialsExport.vue'),
      },
      {
        path: 'search',
        component: () => import('../views/financials/FinancialsSearch.vue'),
      },
      {
        path: ':pathMatch(.*)',
        component: NotFound
      }
    ],
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/dues',
    component: () => import('../views/dues/DuesFrame.vue'),
    children: [
      {
        path: '',
        component: () => import('../views/dues/DuesHome.vue'),
      },
      {
        path: 'mydues',
        component: () => import('../views/dues/DuesMine.vue'),
      },
      {
        path: 'summary',
        component: () => import('../views/dues/DuesSummary.vue'),
      },
      {
        path: 'add',
        component: () => import('../views/dues/DuesAdd.vue'),
      },
      {
        path: 'edit',
        component: () => import('../views/dues/DuesEdit.vue'),
      },
      {
        path: 'income',
        component: () => import('../views/dues/DuesIncome.vue'),
      },
      {
        path: ':pathMatch(.*)',
        component: NotFound
      }
    ],
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/budget',
    component: () => import('../views/budget/BudgetFrame.vue'),
    children: [
      {
        path: '',
        component: () => import('../views/budget/BudgetHome.vue'),
      },
      {
        path: 'modify',
        component: () => import('../views/budget/BudgetModify.vue'),
      },
      {
        path: 'approve',
        component: () => import('../views/budget/BudgetApprove.vue'),
      },
      {
        path: ':pathMatch(.*)',
        component: NotFound
      }
    ],
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/access',
    component: () => import('../views/access/AccessFrame.vue'),
    children: [
      {
        path: '',
        component: () => import('../views/access/AccessHome.vue'),
      },
      {
        path: 'treasurers',
        component: () => import('../views/access/AccessTreasurers.vue'),
      },
      {
        path: 'officers',
        component: () => import('../views/access/AccessOfficers.vue'),
      },
      {
        path: 'internal',
        component: () => import('../views/access/AccessInternal.vue'),
      },
      {
        path: ':pathMatch(.*)',
        component: NotFound
      }
    ],
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/infra',
    component: () => import('../views/infra/InfraFrame.vue'),
    children: [
      {
        path: '',
        component: () => import('../views/infra/InfraHome.vue'),
      },
      {
        path: 'committees',
        component: () => import('../views/infra/InfraCommittees.vue'),
      },
      {
        path: 'fiscal',
        component: () => import('../views/infra/InfraFiscal.vue'),
      },
      {
        path: ':pathMatch(.*)',
        component: NotFound
      }
    ],
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/oidc',
    component: () => import('../views/oidc/OIDCFrame.vue'),
    children: [
      {
        path: 'login',
        component: () => import('../views/oidc/OIDCLogin.vue'),
      },
      {
        path: 'register',
        component: () => import('../views/oidc/OIDCRegister.vue'),
      }
    ],
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/:pathMatch(.*)*',
    component: NotFound,
    meta: {
      requiresAuth: false,
    }
  }
]

const router = createRouter({
  routes,
  history: createWebHistory(import.meta.env.BASE_URL),
});

// Make sure user is logged in before moving
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);

  // Attempt to load auth state
  if (auth_state.state.uname === '') {
    let user = null;

    if (document.cookie.split(';').some((item) => item.trim().startsWith('apikey='))) {
      user = JSON.parse(localStorage.getItem('authState'));
    }

    if (user !== null) {
      auth_state.setAuthState(user);
    }
  }

  if (!requiresAuth) { // does not need auth
    next();
  } else if (requiresAuth && auth_state.state.uname !== '') { // needs auth and auth set
    // verify API key is valid
    const response = await fetch("/api/v2/");
    if (response.status === 401) {
      auth_state.clearAuthState();
      next(`/login?returnto=${to.fullPath}`);
    } else {
      next();
    }
  } else { // need to login
      next(`/login?returnto=${to.fullPath}`);
  }
});

export default router
