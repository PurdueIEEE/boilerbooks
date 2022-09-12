<template>
  <div>
    <h3>My Paid Dues</h3>
    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>
    <div class="text-center">
      <DataTable
        v-bind:rows="rows"
        v-bind:row_key="'duesid'"
        v-bind:row_headers="[
        ['Name','name'],
        ['Email','email'],
        ['Committee(s)','committee'],
        ['Year','fiscal_year'],
        ['Amount','amount'],
        ['Status','status']]"
      >
        <template v-slot:data="dues">
          <td>{{dues.row.name}}</td>
          <td>{{dues.row.email}}</td>
          <td>{{dues.row.committee}}</td>
          <td>{{dues.row.fiscal_year}}</td>
          <td>{{dues.row.amount}}</td>
          <td v-bind:class="{'text-danger':dues.row.status==='Unpaid'}">{{dues.row.status}}</td>
        </template>
      </DataTable>
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

import DataTable from '@/components/DataTable.vue';
import auth_state from '@/state';
import { fetchWrapperJSON } from '@/api_wrapper';

export default {
  name: "DuesMine",
  components: {
    DataTable
  },
  data() {
    return {
      rows: [],
      error: false,
      dispmsg: '',
    }
  },
  async mounted() {
    const response = await fetchWrapperJSON(`/api/v2/account/${auth_state.state.uname}/dues`, {
      method: 'get',
    });

    if (response.error) {
      this.error = true;
      this.dispmsg = response.response;
      return;
    }

    this.rows = response.response;
  }
}
</script>
