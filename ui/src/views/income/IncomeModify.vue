<template>
  <div>
    <h3>Modify Income</h3>
    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>
    <DataTable
      v-bind:rows="rows"
      v-bind:row_key="'incomeid'"
      v-bind:row_headers="[
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
import auth_state from "@/state";

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
    init() {
      fetch(`/api/v2/income`, {
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
        this.error = !response.ok;
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

        this.rows = response;
      })
      .catch((error) => {
        console.log(error);
      });
    },
    updateStatus(id, status) {
      let refnumber = "";
      if (status === "Received") {
        refnumber = prompt("Enter the reference number for this income:");
      }

      this.dispmsg = '';
      fetch(`/api/v2/income/${id}`, {
        method: 'put',
        credentials: 'include',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({status:status, refnumber:refnumber}),
      })
      .then((response) => {
        // API key must have expired
        if (response.status === 401) {
          auth_state.clearAuthState();
          this.$router.replace('/login');
          return response.text();
        }
        this.error = !response.ok
        return response.text();
      })
      .then((response) => {
        this.dispmsg = response;
        if (!this.error) this.init();
      })
      .catch((error) => {
        console.log(error);
      })
    }
  }
}
</script>
