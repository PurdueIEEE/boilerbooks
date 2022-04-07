<template>
  <div>
    <h3>View Purchases</h3>
    <p class="lead">Below are your past purchases for IEEE.</p>
    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>
    <!-- As much as I would like, all the fields do not fit here -->
    <DataTable v-bind:rows="rows">
      <template v-slot:header>
        <th>Date</th>
        <th>Item</th>
        <th>Vendor</th>
        <th>Committee</th>
        <th>Approver</th>
        <th>Amount</th>
        <th>Status</th>
        <th>Cancel</th>
      </template>
      <template v-slot:data="paginatedData">
        <tr v-for="purchase in paginatedData.data" v-bind:key="purchase.purchaseid">
          <td>{{purchase.date}}</td>
          <td><router-link v-bind:to="goToItem(purchase.purchaseid)" class="link-primary text-decoration-none">{{purchase.item}}</router-link></td>
          <td>{{purchase.vendor}}</td>
          <td>{{purchase.committee}}</td>
          <td>{{purchase.approvedby}}</td>
          <td>${{purchase.cost}}</td>
          <td>{{purchase.status}}</td>
          <td><button class="btn btn-danger" v-if="purchase.status === 'Requested' || purchase.status === 'Approved' || purchase.status === 'Purchased'" v-on:click="cancelPurchase(purchase.purchaseid)">Cancel</button></td>
        </tr>
      </template>
    </DataTable>
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
import DataTable from '@/components/DataTable.vue';
import {fetchWrapperJSON, fetchWrapperTXT} from '@/api_wrapper';

export default {
  name: 'PurchaseView',
  components: {
    DataTable,
  },
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
    async cancelPurchase(purchaseid) {
      const response = await fetchWrapperTXT(`/api/v2/purchase/${purchaseid}`, {
        method: 'delete',
        credentials: 'include',
        headers: new Headers({'content-type': 'application/json'}),
      });

      this.dispmsg = response.response;

      if (response.error) {
        this.error = true;
      } else {
        this.init();
      }
    },
    async init() {
      const response = await fetchWrapperJSON(`/api/v2/account/${auth_state.state.uname}/purchases`, {
          method: 'get',
          credentials: 'include',
      });

      if (response.error) {
        this.error = true;
        this.dispmsg = response;
        return;
      }

      this.rows = response.response;
    }
  }
}
</script>
