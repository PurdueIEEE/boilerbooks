<template>
  <div class="container-lg my-5 pt-5">
    <h1>Purchasing</h1>
    <div class="row mt-5">
      <div class="col-md-3">
        <PurchaseNav v-bind:current="current"></PurchaseNav>
      </div>
      <div class="col-md-9">
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
        home: route == '/purchase' || route == '/purchase/',
        request: route.startsWith('/purchase/new'),
        approve: route.startsWith('/purchase/approve'),
        complete: route.startsWith('/purchase/complete'),
        view: route.startsWith('/purchase/view'),
        reimburse: route.startsWith('/purchase/reimburse'),
      }
    }
  }
}
</script>
