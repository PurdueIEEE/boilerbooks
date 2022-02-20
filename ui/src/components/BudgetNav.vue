<template>
  <div class="list-group list-group-flush">
    <router-link to="/budget/modify" class="list-group-item" v-bind:class="{active:current.modify}">Modify Budgets</router-link>
    <router-link to="/budget/approve" class="list-group-item" v-bind:class="{active:current.approve}" v-if="auth_state.viewTreasurer">Approve Budgets</router-link>
    <router-link to="/" class="list-group-item">Boiler Books Home</router-link>
  </div>
</template>

<script>
import auth_state from '@/state';

export default {
  name: 'BudgetNav',
  props: {
    current: Object
  },
  data() {
    return {
      auth_state: auth_state.state,
    }
  }
}
</script>
