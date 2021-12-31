<template>
  <div class="container-lg my-5 pt-5">
    <h1>Purchasing</h1>
    <div class="row mt-5">
      <div class="col-md-4">
        <PurchaseNav v-bind:current="current"></PurchaseNav>
      </div>
      <div class="col-md-8">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import PurchaseNav from '@/components/PurchaseNav.vue'

export default {
  name: 'Purchase',
  components: {
    PurchaseNav
  },
  computed: {
    current() {
      let route = this.$route.path;

      return {
        home: route == '/purchase',
        request: route == '/purchase/new',
        approve: route == '/purchase/approve',
        complete: route == '/purchase/complete',
        view: route == '/purchase/view',
      }
    }
  }
}
</script>
