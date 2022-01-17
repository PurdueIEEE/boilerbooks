<template>
  <div class="list-group list-group-flush">
    <router-link to="/access/treasurers" class="list-group-item" v-bind:class="{active:current.treasurers}">Modify Treasurers</router-link>
    <router-link to="/access/officers" class="list-group-item" v-bind:class="{active:current.officers}">Modify Officers</router-link>
    <router-link to="/access/internal" class="list-group-item" v-bind:class="{active:current.internal}">Modify Internal Leaders</router-link>
    <router-link to="/" class="list-group-item">Boiler Books Home</router-link>
  </div>
</template>

<script>
export default {
  name: "AccessNav",
  props: {
    current: Object,
  }
}
</script>
