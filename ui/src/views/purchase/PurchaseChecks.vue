<template>
  <div>
    <h3>Receive Mailed Checks</h3>
    <p class="lead">Below are your pending mailed reimbursement. Mark them once you receive the check.</p>
    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>
    <!-- As much as I would like, all the fields do not fit here -->
    <DataTable
      v-bind:rows="rows"
      v-bind:row_key="'purchaseID'"
      v-bind:row_headers="[
        ['Date','date'],
        ['Item','item'],
        ['Vendor','vendor'],
        ['Committee','committee'],
        ['Approver','approvedby'],
        ['Amount','cost'],
        ['Received?','']]"
    >
      <template v-slot:data="purchase">
        <td>{{purchase.row.date}}</td>
        <td><router-link v-bind:to="goToItem(purchase.row.purchaseid)" class="link-primary text-decoration-none">{{purchase.row.item}}</router-link></td>
        <td>{{purchase.row.vendor}}</td>
        <td>{{purchase.row.committee}}</td>
        <td>{{purchase.row.approvedby}}</td>
        <td>${{purchase.row.cost}}</td>
        <td><button class="btn btn-success" v-on:click="markReceived(purchase.row.purchaseID)">Check Received</button></td>
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
  name: 'PurchaseChecks',
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
    async markReceived(purchaseid) {
      const response = await fetchWrapperTXT(`/api/v2/purchase/${purchaseid}/checks`, {
        method: 'post',
      });

      this.dispmsg = response.response;

      if (response.error) {
        this.error = true;
      } else {
        this.init();
      }
    },
    async init() {
      const response = await fetchWrapperJSON(`/api/v2/account/${auth_state.state.uname}/checks`, {
          method: 'get',
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
