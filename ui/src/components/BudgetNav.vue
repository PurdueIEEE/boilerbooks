<template>
  <div class="list-group list-group-flush">
    <router-link to="/budget/modify" class="list-group-item" v-bind:class="{active:current.modify}">Modify Budgets</router-link>
    <router-link to="/budget/approve" class="list-group-item" v-bind:class="{active:current.approve}">Approve Budgets</router-link>
    <router-link to="/" class="list-group-item">Boiler Books Home</router-link>
  </div>
</template>

<script>
export default {
  name: 'BudgetNav',
  props: {
    current: Object
  }
}
</script>
