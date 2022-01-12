<template>
  <div class="list-group list-group-flush">
    <router-link to="/income" class="list-group-item" v-bind:class="{active:current.home}">New Donation</router-link>
    <router-link to="/income/modify" class="list-group-item" v-bind:class="{active:current.modify}" v-if="auth_state.viewTreasurer">Modify Income</router-link>
    <router-link to="/" class="list-group-item">Boiler Books Home</router-link>
  </div>
</template>

<script>
import auth_state from '@/state';

export default {
  name: 'IncomeNav',
  data() {
    return {
      auth_state: auth_state.state,
    }
  },
  props: {
    current: Object
  }
}
</script>
