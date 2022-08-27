<template>
  <div>
    <h3>Modify Income</h3>
    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>
    <DataTable
      v-bind:rows="rows"
      v-bind:row_key="'incomeid'"
      v-bind:row_headers="[
        ['Income ID', 'incomeid'],
        ['Date','date'],
        ['Source','source'],
        ['Type','type'],
        ['Amount','amount'],
        ['Committee','committee'],
        ['Item','item'],
        ['Status','status'],
        ['Ref Number','refnumber'],
        ['Modify','']]"
    >
      <template v-slot:data="income">
        <td><router-link v-bind:to="goToIncome(income.row.incomeid)" class="link-primary text-decoration-none">{{income.row.incomeid}}</router-link></td>
        <td>{{income.row.date}}</td>
        <td>{{income.row.source}}</td>
        <td>{{income.row.type}}</td>
        <td>${{income.row.amount}}</td>
        <td>{{income.row.committee}}</td>
        <td>{{income.row.item}}</td>
        <td>{{income.row.status}}</td>
        <td>{{income.row.refnumber}}</td>
        <td>
          <button class="btn btn-outline-info my-1" v-if="income.row.status !== 'Expected'" v-on:click="updateStatus(income.row.incomeid, 'Expected')">Expected</button>
          <br v-if="income.row.status !== 'Expected'">
          <button class="btn btn-outline-success my-1" v-if="income.row.status !== 'Received'" v-on:click="updateStatus(income.row.incomeid, 'Received')">Received</button>
          <br v-if="income.row.status !== 'Received'">
          <button class="btn btn-outline-dark my-1" v-if="income.row.status !== 'Unreceived'" v-on:click="updateStatus(income.row.incomeid, 'Unreceived')">Unreceived</button>
        </td>
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

import DataTable from '@/components/DataTable.vue';
import { fetchWrapperJSON, fetchWrapperTXT } from '@/api_wrapper';

export default {
  name: 'IncomeModify',
  components: {
    DataTable,
  },
  data() {
    return {
      rows: [],
      error: false,
      dispmsg: '',
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      const response = await fetchWrapperJSON(`/api/v2/income`, {
        method: 'get',
        credentials: 'include',
      });

      if (response.error) {
        this.error = true;
        this.dispmsg = response.response;
        return;
      }

      this.rows = response.response;
    },
    async updateStatus(id, status) {
      let refnumber = "";
      if (status === "Received") {
        refnumber = prompt("Enter the reference number for this income:");
      }

      this.dispmsg = '';
      const response = await fetchWrapperTXT(`/api/v2/income/${id}`, {
        method: 'put',
        credentials: 'include',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({status:status, refnumber:refnumber}),
      });

      this.error = response.error;
      this.dispmsg = response.response;

      if (!response.error) {
        this.init();
      }
    },
    goToIncome(id) {
      return `/income-view?id=${id}`;
    },
  }
}
</script>
