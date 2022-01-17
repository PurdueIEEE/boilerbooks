<template>
  <div class="container-lg my-5 pt-5">
    <h1>Adjust Access Roles</h1>
    <div class="row mt-5">
      <div class="col-md-3">
        <AccessNav v-bind:current="current"></AccessNav>
      </div>
      <div class="col-md-9">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import AccessNav from '@/components/AccessNav.vue';

export default {
  name: "Access",
  components: {
    AccessNav,
  },
  computed: {
    current() {
      let route = this.$route.path;

      return {
        home: route == '/access' || route == '/access/',
        treasurers: route.startsWith('/access/treasurers'),
        officers: route.startsWith('/access/officers'),
        internal: route.startsWith('/access/internal'),
      }
    }
  }
}
</script>
