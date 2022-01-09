<template>
  <div class="container-lg my-5 pt-5">
    <h1>Purchase #{{purchase.purchaseid}}: {{purchase.item}}</h1>
    <br>
    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>
    <p class="lead">Last Modified at <u>{{purchase.mdate}}</u></p>
    <br>
    <div class="row">
      <!-- This looks misaligned but its actually centered -->
      <div class="col-md-8 offset-md-2">
        <div class="row g-0 text-start">
          <div class="col-md-6 border border-secondary p-3">
          <p class="fs-5">Purchased By: <span class="fw-bold">{{purchase.purchasedby}}</span></p>
          </div>
          <div class="col-md-6 border border-secondary p-3">
            <p class="fs-5">Purchase date: <span class="fw-bold">{{purchase.date}}</span></p>
          </div>
          <div class="col-md-6 border border-secondary p-3">
            <p class="fs-5">Purchase Reason: <span class="fw-bold">{{purchase.purchasereason}}</span></p>
          </div>
          <div class="col-md-6 border border-secondary p-3">
            <p class="fs-5">Status: <span class="fw-bold">{{purchase.status}}</span></p>
          </div>
          <div class="col-md-6 border border-secondary p-3">
            <p class="fs-5">Cost: <span class="fw-bold">${{purchase.cost}}</span></p>
          </div>
          <div class="col-md-6 border border-secondary p-3">
            <p class="fs-5">Vendor: <span class="fw-bold">{{purchase.vendor}}</span></p>
          </div>
          <div class="col-md-6 border border-secondary p-3">
            <p class="fs-5">Category: <span class="fw-bold">{{purchase.category}}</span></p>
          </div>
          <div class="col-md-6 border border-secondary p-3">
            <p class="fs-5">Approved By: <span class="fw-bold">{{purchase.approvedby}}</span></p>
          </div>
          <div class="col-md-6 border border-secondary p-3">
            <p class="fs-5">Committee: <span class="fw-bold">{{purchase.committee}}</span></p>
          </div>
          <div class="col-md-6 border border-secondary p-3">
            <p class="fs-5">Funding Source: <span class="fw-bold">{{purchase.fundsource}}</span></p>
          </div>
          <div class="col-md-6 border border-secondary p-3">
            <p class="fs-5">Fiscal Year: <span class="fw-bold">{{purchase.fiscalyear}}</span></p>
          </div>
          <div class="col-md-6 border border-secondary p-3">
            <p class="fs-5">Comments: <span class="fw-bold">{{purchase.comments}}</span></p>
          </div>
        </div>
      </div>
    </div>
    <br>
    <div class="fs-3">
      <a v-bind:href="fullRecipt" target="_blank" v-if="purchase.receipt">Open receipt in new tab </a>
      <span v-else>No receipt for this purchase</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetailView',
  data() {
    return {
      purchase: {},
      error: false,
      dispmsg: '',
    }
  },
  mounted() {
    fetch(`http://${location.hostname}:3000/purchase/${this.$route.query.id}`, {
        method: 'get',
        credentials: 'include',
    })
    .then((response) => {
      // API key must have expired
      if (response.status === 401) {
        this.$router.replace('/login');
        return response.text()
      }
      if (!response.ok) {
        this.error = true;
        return response.text();
      }

      return response.json();
    })
    .then((response) => {
      if (this.error) {
        this.dispmsg = response;
        return;
      }

      this.purchase = response;
    })
    .catch((error) => {
      console.log(error);
    });
  },
  computed: {
    fullRecipt() {
      return `http://${location.hostname}:3000${this.purchase.receipt}`;
    }
  }
}
</script>
