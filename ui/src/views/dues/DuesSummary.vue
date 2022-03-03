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
    <table class="table table-striped table-hover" style="table-layout: fixed;">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Committee(s)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="data in paginatedData" v-bind:key="data.key">
          <td>{{data.name}}</td>
          <td>{{data.email}}</td>
          <td>{{data.committee}}</td>
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

import mixin from "@/mixins/DataTables";

export default {
  name: "DuesSummary",
  mixins: [mixin],
  data() {
    return {
      duesSumm: {},
      rows: [],
      error: false,
      dispmsg: '',
    }
  },
  mounted() {
    fetch('/api/v2/dues/summary',{
      method: 'get',
      credentials: 'include'
    })
    .then((response) => {
      // API key must have expired
      if (response.status === 401) {
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
      this.duesSumm = response;
    })
    .catch((error) => {
      console.log(error);
    });

    fetch('/api/v2/dues/all',{
      method: 'get',
      credentials: 'include'
    })
    .then((response) => {
      // API key must have expired
      if (response.status === 401) {
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
</script>
