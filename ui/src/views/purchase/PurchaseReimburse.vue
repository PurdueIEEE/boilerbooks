<template>
  <div>
    <h3>Reimburse Purchases</h3>
    <p class="lead">Select purchases to reimburse</p>
    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>
    <!-- As much as I would like, all the fields do not fit here -->
    <DataTable
      v-bind:rows="rows"
      v-bind:row_key="'purchaseID'"
      v-bind:row_headers="[
        ['Purchase ID', 'purchaseID'],
        ['Date','date'],
        ['Item','item'],
        ['Vendor','vendor'],
        ['Committee','committee'],
        ['Purchaser','purchasedby'],
        ['Amount','cost'],
        ['Funding','fundsource'],
        ['Status','status'],
        ['Process','']]"
      >
      <template v-slot:data="purchase">
        <td><router-link v-bind:to="goToItem(purchase.row.purchaseID)" class="link-primary text-decoration-none">{{purchase.row.purchaseID}}</router-link></td>
        <td>{{purchase.row.date}}</td>
        <td><a v-bind:href="computeReceipt(purchase.row.receipt)" class="link-primary text-decoration-none" target="_blank">{{purchase.row.item}}</a></td>
        <td>{{purchase.row.vendor}}</td>
        <td>{{purchase.row.committee}}</td>
        <td><router-link v-bind:to="goToUser(purchase.row.username)" class="link-primary text-decoration-none">{{purchase.row.purchasedby}}</router-link></td>
        <td>${{purchase.row.cost}}</td>
        <td>{{purchase.row.fundsource}}</td>
        <td>{{purchase.row.status}}</td>
        <td><button class="btn btn-secondary" v-on:click="addToBox(purchase.row.purchaseID)">Add</button></td>
      </template>
    </DataTable>
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
import { fetchWrapperJSON, fetchWrapperTXT } from '@/api_wrapper';

export default {
  name: 'PurchaseReimburse',
  components: {
    DataTable,
  },
  data() {
    return {
      dispmsg: '',
      error: false,
      rows: [],
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
      return `/api/v2${fp}`
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
    async processPurchase(status) {
      this.dispmsg = '';
      const response = await fetchWrapperTXT(`/api/v2/purchase/treasurer`, {
        method: 'post',
        credentials: 'include',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({status:status, idList:this.processList}),
      });

      this.error = response.error;
      this.dispmsg = response.response;

      if (!response.error) {
        this.processList = '';
        this.init();
      }
    },
    async init() {
      const response = await fetchWrapperJSON(`/api/v2/account/${auth_state.state.uname}/reimbursements`, {
          method: 'get',
          credentials: 'include',
      });

      if (response.error) {
        this.error = true;
        this.dispmsg = response.response
        return;
      }

      this.rows = response.response;
    }
  }
}
</script>
