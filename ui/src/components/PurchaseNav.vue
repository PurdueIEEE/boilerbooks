<template>
  <div class="list-group list-group-flush">
    <router-link to="/purchase/new" class="list-group-item" v-bind:class="{active:current.request}">Request Purchase</router-link>
    <router-link to="/purchase/approve" class="list-group-item" v-bind:class="{active:current.approve}" v-if="auth_state.viewApprove">Approve Purchase</router-link>
    <router-link to="/purchase/complete" class="list-group-item" v-bind:class="{active:current.complete}">Complete Purchase</router-link>
    <router-link to="/purchase/reimburse" class="list-group-item" v-bind:class="{active:current.reimburse}" v-if="auth_state.viewTreasurer">Reimburse Purchases</router-link>
    <router-link to="/purchase/view" class="list-group-item" v-bind:class="{active:current.view}">View Purchases</router-link>
    <router-link to="/" class="list-group-item">Boiler Books Home</router-link>
  </div>
</template>

<script>
import auth_state from '@/state';

export default {
  name: 'PurchaseNav',
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
