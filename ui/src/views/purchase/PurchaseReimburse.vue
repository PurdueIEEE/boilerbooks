<template>
  <div>
    <h3>Reimburse Purchases</h3>
    <p class="lead">Select purchases to reimburse</p>
    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>
    <!-- As much as I would like, all the fields do not fit here -->
    <table class="table table-hover table-striped">
      <thead>
        <tr>
          <th>Purchase ID</th>
          <th>Date</th>
          <th>Item</th>
          <th>Vendor</th>
          <th>Committee</th>
          <th>Purchaser</th>
          <th>Amount</th>
          <th>Funding</th>
          <th>Status</th>
          <th>Process</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="purchase in purchaseList" v-bind:key="purchase.purchaseID">
          <td><router-link v-bind:to="goToItem(purchase.purchaseID)" class="link-primary text-decoration-none">{{purchase.purchaseID}}</router-link></td>
          <td>{{purchase.date}}</td>
          <td><a v-bind:href="computeReceipt(purchase.receipt)" class="link-primary text-decoration-none" target="_blank">{{purchase.item}}</a></td>
          <td>{{purchase.vendor}}</td>
          <td>{{purchase.committee}}</td>
          <td><router-link v-bind:to="goToUser(purchase.username)" class="link-primary text-decoration-none">{{purchase.purchasedby}}</router-link></td>
          <td>${{purchase.cost}}</td>
          <td>{{purchase.fundsource}}</td>
          <td>{{purchase.status}}</td>
          <td><button class="btn btn-secondary" v-on:click="addToBox(purchase.purchaseID)">Add</button></td>
        </tr>
      </tbody>
    </table>
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <label class="form-label" for="selectedBox">Selected:</label>
        <input class="form-control" id="selectedBox" placeholder="Enter purchase IDs or click above" v-model="processList">
        <button class="btn btn-info m-3" v-on:click="processPurchase('Processing Reimbursement')">Mark Processing</button>
        <button class="btn btn-success m-3" v-on:click="processPurchase('Reimbursed')">Mark Reimbursed</button>
      </div>
    </div>
  </div>
</template>

<script>
import auth_state from '@/state';

export default {
  name: 'PurchaseReimburse',
  data() {
    return {
      dispmsg: '',
      error: false,
      purchaseList: [],
      processList: '',
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    goToItem(id) {
      return `/detail-view?id=${id}`;
    },
    goToUser(id) {
      return `/user-view?id=${id}`;
    },
    computeReceipt(fp) {
      return `http://${location.hostname}/api${fp}`
    },
    addToBox(id) {
      if(this.processList === '') {
        this.processList = id.toString();
      } else {
          let existingIds = this.processList.split(',');
          if(!existingIds.includes(id.toString())) {
              this.processList += ',' + id;
          }
      }
    },
    processPurchase(status) {
      this.dispmsg = '';
      fetch(`http://${location.hostname}/api/purchase/treasurer`, {
        method: 'post',
        credentials: 'include',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({status:status, idList:this.processList}),
      })
      .then((response) => {
        // API key must have expired
        if (response.status === 401) {
          this.$router.replace('/login');
          return response.text();
        }
        this.error = !response.ok
        return response.text();
      })
      .then((response) => {
        this.dispmsg = response;
        this.processList = '';
        this.init();
      })
      .catch((error) => {
        console.log(error);
      });
    },
    init() {
      fetch(`http://${location.hostname}/api/account/${auth_state.state.uname}/reimbursements`, {
          method: 'get',
          credentials: 'include',
      })
      .then((response) => {
        // API key must have expired
        if (response.status === 401) {
          this.$router.replace('/login');
          return response.text();
        }
        this.error = !response.ok
        if (!response.ok) {
          return response.text();
        }

        return response.json();
      })
      .then((response) => {
        if (this.error) {
          this.dispmsg = response;
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
