<template>
  <div class="container-lg my-5 pt-5">
    <h1>Income and Donations</h1>
    <div class="row mt-5">
      <div class="col-md-3">
        <IncomeNav v-bind:current="current"></IncomeNav>
      </div>
      <div class="col-md-9">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import IncomeNav from '@/components/IncomeNav.vue';

export default {
  name: 'Income',
  components: {
    IncomeNav,
  },
  computed: {
    current() {
      let route = this.$route.path;

      return {
        home: route == '/income' || route == '/income/',
        modify: route.startsWith('/income/modify'),
      }
    }
  }
}
</script>
