<template>
  <div class="container-lg my-5 pt-5">
    <h1>IEEE Financials</h1>
    <div class="row mt-5">
      <div class="col-md-3">
        <FinancialsNav v-bind:current="current"></FinancialsNav>
      </div>
      <div class="col-md-9">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import FinancialsNav from '@/components/FinancialsNav.vue';

export default {
  name: 'Financials',
  components: {
    FinancialsNav,
  },
  computed: {
    current() {
      let route = this.$route.path;

      return {
        home: route == '/financials' || route == '/financials/',
        committee: route.startsWith('/financials/committee'),
      }
    }
  }
}
</script>
