<template>
  <div id="app">

    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <div class="container-lg">
          <router-link class="navbar-brand fw-bold" to="/">Boiler Books {{dev ? "[DEV]" : ""}}</router-link>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarlink" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarlink">
            <ul class="navbar-nav ms-auto mb-1">
              <li class="nav-item mx-1" v-if="showUser"><router-link class="nav-link" active-class="active" to="/purchase"><i class="bi bi-cart-plus-fill me-1"></i>Purchasing</router-link></li>
              <li class="nav-item mx-1" v-if="showUser&&auth_state.viewFinancials"><router-link class="nav-link" active-class="active" to="/income"><i class="bi bi-piggy-bank-fill me-1"></i>Income</router-link></li>
              <li class="nav-item mx-1" v-if="showUser&&auth_state.viewFinancials"><router-link class="nav-link" active-class="active" to="/financials"><i class="bi bi-bank2 me-1"></i>Financials</router-link></li>
              <li class="nav-item mx-1" v-if="showUser"><router-link class="nav-link" active-class="active" to="/dues"><i class="bi bi-cash-coin me-1"></i>Dues</router-link></li>
              <li class="nav-item mx-1" v-if="showUser"><span class="nav-link">|</span></li>
              <li class="nav-item mx-1" v-if="showUser"><router-link class="nav-link" active-class="active" to="/myaccount"><i class="bi bi-person-fill me-1"></i>{{auth_state.full_name}}</router-link></li>
              <li class="nav-item mx-1"><router-link class="nav-link" active-class="active" to="/help"><i class="bi bi-question-circle-fill me-1"></i>Help</router-link></li>
              <li class="nav-item mx-1" v-if="showUser"><span class="nav-link" style="cursor:pointer" v-on:click="logout"><i class="bi bi-box-arrow-right me-1"></i>Sign Out</span></li>
              <li class="nav-item mx-1"><a class="nav-link" href="https://purdueieee.org/"><img class="me-2" src="./assets/pieee-kite.svg" alt="" width="25" height="25">Purdue IEEE</a></li>
            </ul>
          </div>
        </div>
      </nav>

    <router-view/>

    <footer>
        <div class="container-fluid text-center py-3">
            <p class="text-center fs-5 my-0"><a href="https://github.com/PurdueIEEE/boilerbooks" target="_blank" class="dark-link">View page on GitHub</a></p>
            <p class="text-center">{{version_string}}</p>
            <p class="text-center lead">Copyright © Purdue IEEE<br>with Hadi Ahmed and Kyle Rakos</p>
        </div>
    </footer>
  </div>
</template>

<script>
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

import auth_state from '@/state';

export default {
  name:"BoilerBooks",
  data() {
    return {
      auth_state: auth_state.state,
      dev: import.meta.env.MODE === "dev",
      version_string: import.meta.env.VITE_VERSION_STRING
    }
  },
  computed: {
    showUser() {
      return this.auth_state.uname !== '';
    }
  },
  methods: {
    logout() {
      auth_state.clearAuthState();
      // TODO this should invalidate the API key
      if (import.meta.env.VITE_USE_OIDC === "true") {
        window.location.href = '/api/v2/oidc/logout';
      } else {
        this.$router.push('/login');
      }
    }
  },
  mounted() {
    if (this.dev) {
      document.getElementById("favicon").href = `${import.meta.env.BASE_URL}dev-favicon.ico`;
      document.title = "Boiler Books [DEV]"
    }
  }
}
</script>

<style>
#app {
  text-align: center;
}

.dark-link {
  text-decoration: none;
  color: black;
}

.dark-link:hover {
  text-decoration: underline;
  color: black;
}

.debug {
  outline: 2px solid red;
}
</style>
