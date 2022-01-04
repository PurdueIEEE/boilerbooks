<template>
  <div id="app">

    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <div class="container-lg">
          <router-link class="navbar-brand fw-bold" to="/">Boiler Books</router-link>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarlink" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarlink">
            <ul class="navbar-nav ms-auto mb-2">
              <li class="nav-item mx-3" v-if="showUser"><router-link class="nav-link" to="/myaccount"><i class="bi bi-person-fill me-1"></i>{{auth_state.uname}}</router-link></li>
              <li class="nav-item mx-3" v-if="showUser"><router-link class="nav-link" to="/myaccount"><i class="bi bi-gear-fill me-1"></i>Settings</router-link></li>
              <li class="nav-item mx-3"><router-link class="nav-link" to="/help"><i class="bi bi-question-circle-fill me-1"></i>Help</router-link></li>
              <li class="nav-item mx-3" v-if="showUser"><span class="nav-link" style="cursor:pointer" v-on:click="logout"><i class="bi bi-box-arrow-right me-1"></i>Sign Out</span></li>
              <li class="nav-item mx-3"><a class="nav-link" href="https://purdueieee.org/"><img class="me-2" src="./assets/IEEE-Kite.svg" alt="" width="20" height="20">Purdue IEEE</a></li>
            </ul>
          </div>
        </div>
      </nav>

    <router-view/>

    <footer>
        <div class="container-fluid text-center py-3">
            <p class="text-center fs-5 my-0"><a href="https://github.com/PurdueIEEE/boilerbooks" target="_blank" class="dark-link">View page on GitHub</a></p>
            <p class="text-center lead">Copyright © {{this.year}} Purdue IEEE and Hadi Ahmed</p>
        </div>
    </footer>
  </div>
</template>

<script>
import auth_state from '@/state';

export default {
  name:"App",
  data() {
    return {
      auth_state: auth_state.state,
      year: new Date().getFullYear(),
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
      this.$router.push('/login');
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
