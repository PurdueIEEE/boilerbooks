<template>
  <div>
    <h3>Total Reported Dues</h3>
    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>
    <table class="table table-sm table-striped">
      <thead>
        <tr>
          <th>Committee</th>
          <th>Members</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(val, comm) in duesSumm" v-bind:key="comm">
          <td>{{comm}}</td>
          <td>{{val}}</td>
        </tr>
      </tbody>
    </table>
    <p class="fs-4">{{rows.length}} total members in current fiscal year.</p>
    <br>
    <h3>All Members</h3>
    <DataTable
      v-bind:rows="rows"
      v-bind:row_key="'duesid'"
      v-bind:row_headers="[
      ['Name','name'],
      ['Email','email'],
      ['Committee(s)','committee']]"
    >
      <template v-slot:data="dues">
        <td>{{dues.row.name}}</td>
        <td>{{dues.row.email}}</td>
        <td>{{dues.row.committee}}</td>
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

import DataTable from '@/components/DataTable.vue'
import { fetchWrapperJSON } from '@/api_wrapper';

export default {
  name: "DuesSummary",
  components: {
    DataTable,
  },
  data() {
    return {
      duesSumm: {},
      rows: [],
      error: false,
      dispmsg: '',
    }
  },
  async mounted() {
    const duesSum = await fetchWrapperJSON('/api/v2/dues/summary',{
      method: 'get',
      credentials: 'include'
    });

    const duesAll = await fetchWrapperJSON('/api/v2/dues/all',{
      method: 'get',
      credentials: 'include'
    });

    if (duesSum.error) {
      this.error = true;
      this.dispmsg = duesSum.response;
      return;
    }

    if (duesAll.error) {
      this.error = true;
      this.dispmsg = duesAll.response;
      return;
    }

    this.duesSumm = duesSum.response;
    this.rows = duesAll.response;
  }
}
</script>
