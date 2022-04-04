<template>
  <div >
    <h3>View Purchases</h3>
    <p class="lead">Below are your past purchases for IEEE.</p>
    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
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
        <tr v-for="purchase in paginatedData" v-bind:key="purchase.purchaseid">
          <td>{{purchase.date}}</td>
          <td><router-link v-bind:to="goToItem(purchase.purchaseid)" class="link-primary text-decoration-none">{{purchase.item}}</router-link></td>
          <td>{{purchase.vendor}}</td>
          <td>{{purchase.committee}}</td>
          <td>{{purchase.approvedby}}</td>
          <td>${{purchase.cost}}</td>
          <td>{{purchase.status}}</td>
          <td><button class="btn btn-danger" v-if="purchase.status === 'Requested' || purchase.status === 'Approved' || purchase.status === 'Purchased'" v-on:click="cancelPurchase(purchase.purchaseid)">Cancel</button></td>
        </tr>
      </tbody>
    </table>
    <div class="row">
      <span class="col">Showing {{currPageStart}} - {{currPageEnd}} of {{rows.length}} entries</span>
      <span class="col"><button class="btn btn-secondary" v-bind:disabled="currPage==0" v-on:click="currPageRaw-=1">Prev</button></span>
      <span class="col">Page {{currPage+1}} of {{maxPage+1}}</span>
      <span class="col"><button class="btn btn-secondary" v-bind:disabled="currPage==maxPage" v-on:click="currPageRaw+=1">Next</button></span>
      <span class="col">
        <select class="form-select" v-model="maxElemPerPage">
          <option value="10">10 entries</option>
          <option value="25">25 entries</option>
          <option value="50">50 entries</option>
        </select>
      </span>
    </div>
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
import mixin from '@/mixins/DataTables';

export default {
  name: 'PurchaseView',
  mixins: [mixin],
  data() {
    return {
      dispmsg: '',
      error: false,
      rows: []
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    goToItem(id) {
      return `/detail-view?id=${id}`;
    },
    cancelPurchase(purchaseid) {
      fetch(`/api/v2/purchase/${purchaseid}`, {
        method: 'delete',
        credentials: 'include',
        headers: new Headers({'content-type': 'application/json'}),
      })
      .then((response) => {
        // API key must have expired
        if (response.status === 401) {
          auth_state.clearAuthState();
          this.$router.replace('/login');
          return response.text()
        }
        this.error = !response.ok;
        return response.text();
      })
      .then((response) => {
        this.dispmsg = response;
        if(!this.error) this.init();
      })
    },
    init() {
      fetch(`/api/v2/account/${auth_state.state.uname}/purchases`, {
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

        this.rows = response;
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }
}
</script>
