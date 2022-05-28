<template>
    <div>
    <h3>Modify Dues Payment Status</h3>
    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>
    <div class="text-center">
      <DataTable
        v-bind:rows="rows"
        v-bind:row_key="'duesid'"
        v-bind:row_headers="[
        ['Name','name'],
        ['Email','email'],
        ['Year','fiscal_year'],
        ['Status','status'],
        ['Update','']]"
      >
        <template v-slot:data="dues">
          <td>{{dues.row.name}}</td>
          <td>{{dues.row.email}}</td>
          <td>{{dues.row.fiscal_year}}</td>
          <td>{{dues.row.status}}</td>
          <td>
            <button class="btn btn-outline-info my-1" v-on:click="updateStatus(dues.row.duesid, 'Paid')">Paid</button>
            <br>
            <button class="btn btn-outline-dark my-1" v-on:click="updateStatus(dues.row.duesid, 'Exempt')">Exempt</button>
          </td>
        </template>
      </DataTable>
      <br/><br/>
      <h5>NOTE: 'Exempt' members are those who have an existing International IEEE membership.</h5>
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

import { fetchWrapperJSON, fetchWrapperTXT } from '@/api_wrapper';
import DataTable from '@/components/DataTable.vue';

export default {
    name: "DuesStatus",
  components: {
    DataTable
  },
  data() {
      return {
          rows: [],
          error: false,
          dispmsg: "",
      };
  },
  async mounted() {
    this.init();
  },
  methods: {
    async init() {
      const response = await fetchWrapperJSON('/api/v2/dues/all',{
        method: 'get',
        credentials: 'include'
      });

      if (response.error) {
        this.error = true;
        this.dispmsg = response.response;
        return;
      }

      this.rows = response.response;
    },
    async updateStatus(id, status) {
      this.dispmsg = '';
      const response = await fetchWrapperTXT(`/api/v2/dues/${id}`,{
        method: 'put',
        credentials: 'include',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({status:status}),
      });

      this.error = response.error;
      this.dispmsg = response.response;

      if (!response.error) {
        this.init();
      }
    }
  }
}
</script>
