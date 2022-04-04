<template>
  <div class="container-lg my-5 pt-5">
    <h1>Purchase #{{purchase.purchaseid}}: {{purchase.item}}</h1>
    <br>
    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>
    <p class="lead">Last Modified at <u>{{localDate}}</u></p>
    <button class="btn btn-primary" v-if="!editPurchase&&auth_state.viewTreasurer&&allowedToEdit" v-on:click="editPurchase=!editPurchase">Update Purchase Details</button>
    <button class="btn btn-secondary" v-else-if="editPurchase" v-on:click="finishEdit">Finish Purchase Edit</button>
    <br><br>
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
            <p class="fs-5">Purchase Reason:
              <span class="fw-bold" v-if="!editPurchase">{{purchase.purchasereason}}</span>
              <input class="form-control" v-else v-model="reason">
            </p>
          </div>
          <div class="col-md-6 border border-secondary p-3">
            <p class="fs-5">Status: <span class="fw-bold">{{purchase.status}}</span></p>
          </div>
          <div class="col-md-6 border border-secondary p-3">
            <div class="fs-5">Cost:
              <span class="fw-bold" v-if="!editPurchase">${{purchase.cost}}</span>
              <div class="input-group" v-else>
                <span class="input-group-text">$</span>
                <input id="costDollars" type="number" step=".01" class="form-control" v-model="cost">
              </div>
            </div>
          </div>
          <div class="col-md-6 border border-secondary p-3">
            <p class="fs-5">Vendor:
              <span class="fw-bold" v-if="!editPurchase">{{purchase.vendor}}</span>
              <input class="form-control" v-else v-model="vendor">
            </p>
          </div>
          <div class="col-md-6 border border-secondary p-3">
            <div class="fs-5">Category:
              <span class="fw-bold" v-if="!editPurchase">{{purchase.category}}</span>
              <select class="form-select" v-model="category" v-if="editPurchase">
                <option v-for="key in categoryList" v-bind:key="key.category">{{key.category}}</option>
              </select>
            </div>
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
            <p class="fs-5">Comments:
              <span class="fw-bold" v-if="!editPurchase">{{purchase.comments}}</span>
              <input class="form-control" v-else v-model="comments">
            </p>
          </div>
        </div>
      </div>
    </div>
    <br><br>
    <div class="fs-3">
      <a v-bind:href="fullRecipt" target="_blank" v-if="purchase.receipt">Open receipt in new tab</a>
      <span v-else>No receipt for this purchase</span>
    </div>
    <br>
    <form v-on:submit.prevent="updateReceipt" v-if="auth_state.viewTreasurer&&purchase.receipt">
      <div class="row">
        <div class="col-md-6 offset-md-2">
          <input id="receiptFile" type="file" class="form-control" accept="image/png, image/jpeg, application/pdf" required>
        </div>
        <div class="col-md-2">
          <button class="btn btn-success" type="submit">Update Receipt</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
/*
  Copyright 2022 Purdue IEEE and Hadi Ahmed

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import auth_state from '@/state';

export default {
  name: 'DetailView',
  data() {
    return {
      purchase: {},
      error: false,
      dispmsg: '',
      auth_state: auth_state.state,
      reason: '',
      cost: '',
      vendor: '',
      comments: '',
      category: '',
      item: '',
      editPurchase: false,
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.$route.query.id === undefined || this.$route.query.id === '') {
        return;
      }
      fetch(`/api/v2/purchase/${this.$route.query.id}`, {
          method: 'get',
          credentials: 'include',
      })
      .then((response) => {
        // API key must have expired
        if (response.status === 401) {
          auth_state.clearAuthState();
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
        this.reason = response.purchasereason;
        this.vendor = response.vendor;
        this.item = response.item;
        this.comments = response.comments;
        this.category = response.category;
        this.cost = response.cost;
      })
      .catch((error) => {
        console.log(error);
      });
    },
    finishEdit() {
      this.dispmsg = '';
      fetch(`/api/v2/purchase/${this.$route.query.id}`, {
        method: 'put',
        credentials: 'include',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({reason:this.reason,cost:this.cost,vendor:this.vendor,comments:this.comments,category:this.category}),
      })
      .then((response) => {
        // API key must have expired
        if (response.status === 401) {
          this.$router.replace('/login');
          return response.text()
        }
        this.error = !response.ok;
        return response.text();
      })
      .then((response) => {
        this.dispmsg = response;
        if (!this.error) {
          this.editPurchase = false;
          this.init();
        }
      })
      .catch((error) => {
        console.log(error);
      });
    },
    updateReceipt() {
      this.dispmsg = '';
      const formData = new FormData();
      const fileInput = document.querySelector('#receiptFile');

      formData.append('receipt', fileInput.files[0]);

      fetch(`/api/v2/purchase/${this.$route.query.id}/receipt`, {
        method: 'post',
        credentials: 'include',
        headers: new Headers({}),
        body: formData,
      })
      .then((response) => {
        // API key must have expired
        if (response.status === 401) {
          this.$router.replace('/login');
          return response.text()
        }
        this.error = !response.ok;
        if (response.ok) {
          this.currentComplete = '';
          this.init();
        }
        return response.text();
      })
      .then((response) => {
        this.dispmsg = response;
      })
      .catch((error) => {
        console.log(error);
      });
    }
  },
  computed: {
    fullRecipt() {
      return `/api/v2${this.purchase.receipt}`;
    },
    localDate() {
      if (this.purchase.mdate === undefined) return "";
      const d = new Date(this.purchase.mdate);
      return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")} ` +
              `${d.getHours().toString().padStart(2, "0")}:${(d.getMinutes()+1).toString().padStart(2, "0")}:${(d.getSeconds()+1).toString().padStart(2, "0")}`;
    },
    allowedToEdit() {
      if (this.purchase.status === undefined) return false;
      return this.purchase.status==='Requested' || this.purchase.status==='Approved' || this.purchase.status==='Purchased';
    }
  },
  asyncComputed: {
    async categoryList() {
      this.dispmsg = '';
      if (this.purchase.committeeAPI === undefined) {
        return [];
      }

      return await fetch(`/api/v2/committee/${this.purchase.committeeAPI}/categories`, {
        method: 'get',
        credentials: 'include'
      })
      .then((response) => {
        // API key must have expired
        if (response.status === 401) {
          auth_state.clearAuthState();
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
          return [];
        }

        return response;
      })
      .catch((error) => {
        console.log(error);
        return [];
      });
    }
  }
}
</script>
