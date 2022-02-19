<template>
  <div class="container-lg my-5 pt-5">
    <h1>Committee Budgets</h1>
    <div class="row mt-5">
      <div class="col-md-3">
        <BudgetNav v-bind:current="current"></BudgetNav>
      </div>
      <div class="col-md-9">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import BudgetNav from '@/components/BudgetNav.vue';

export default {
  name: 'Budget',
  components: {
    BudgetNav,
  },
  computed: {
    current() {
      let route = this.$route.path;

      return {
        home: route == '/budget' || route == '/budget/',
        modify: route.startsWith('/budget/modify'),
        approve: route.startsWith('/budget/approve'),
      }
    }
  }
}
</script>
