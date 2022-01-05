<template>
  <div >
    <h3>View Purchases</h3>
    <p class="lead">Below are your past purchases for IEEE.</p>
    <div v-if="errmsg!==''" class="lead fw-bold my-1 fs-3 text-danger">{{errmsg}}</div>
    <br v-else>
    <!-- As much as I would like, all the fields do not fit here -->
    <table class="table table-hover table-striped">
      <thead>
        <tr>
          <th>Date</th>
          <th>Item</th>
          <th>Vendor</th>
          <th>Committee</th>
          <th>Approver</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Cancel</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="purchase in purchaseList" v-bind:key="purchase.purchaseid">
          <td>{{purchase.date}}</td>
          <td><span v-on:click="goToItem(purchase.purchaseid)" class="link-primary" style="cursor:pointer;">{{purchase.item}}</span></td>
          <td>{{purchase.vendor}}</td>
          <td>{{purchase.committee}}</td>
          <td>{{purchase.approvedby}}</td>
          <td>${{purchase.cost}}</td>
          <td>{{purchase.status}}</td>
          <td><button class="btn btn-danger" v-if="purchase.status === 'Requested' || purchase.status === 'Approved' || purchase.status === 'Purchased'" v-on:click="cancelPurchase(purchase.purchaseid)">Cancel</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import auth_state from '@/state';

export default {
  name: 'PurchaseView',
  data() {
    return {
      errmsg: '',
      error: false,
      purchaseList: []
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    goToItem(purchaseid) {
      this.$router.push(`/detail-view?id=${purchaseid}`)
    },
    cancelPurchase(purchaseid) {
      fetch(`http://${location.hostname}:3000/purchase/${purchaseid}`, {
        method: 'delete',
        headers: new Headers({'x-api-key': auth_state.state.apikey,'content-type': 'application/json'}),
      })
      .then((response) => {
        this.error = !response.ok;
        return response.text();
      })
      .then((response) => {
        this.errmsg = response;
        if(!this.error) this.init();
      })
    },
    init() {
      fetch(`http://${location.hostname}:3000/account/${auth_state.state.uname}/purchases`, {
          method: 'get',
          headers: new Headers({'x-api-key': auth_state.state.apikey,'content-type': 'application/json'}),
      })
      .then((response) => {
        if (!response.ok) {
          this.error = true;
          return response.text();
        }

        return response.json();
      })
      .then((response) => {
        if (this.error) {
          this.errmsg = response;
          return;
        }

        this.purchaseList = response;
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }
}
</script>
