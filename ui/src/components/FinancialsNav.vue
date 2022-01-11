<template>
  <div class="list-group list-group-flush">
    <router-link to="/financials" class="list-group-item" v-bind:class="{active:current.home}">Current Balances</router-link>
    <router-link to="/financials/committee" class="list-group-item" v-bind:class="{active:current.committee}">Committee Breakdown</router-link>
    <router-link to="/" class="list-group-item">Boiler Books Home</router-link>
  </div>
</template>

<script>
export default {
  name: 'FinancialsNav',
  props: {
    current: Object
  }
}
</script>
