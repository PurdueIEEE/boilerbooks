<template>
  <div>
    <h3>Export Committee Financials</h3>
    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>
    <form v-on:submit.prevent="getCSV" class="row g-3 text-start">
      <div class="col-12">
        <label for="committeeSelect" class="form-label fw-bold">Committee</label>
        <select id="committeeSelect" class="form-select" v-model="committee" required>
          <option selected disabled value="">Select...</option>
          <option v-for="(val,com) in committeeList" v-bind:key="com" v-bind:value="com">{{val}}</option>
        </select>
      </div>
      <div class="col-6">
        <label for="startDate" class="form-label fw-bold">Start Date</label>
        <input id="startDate" type="date" class="form-control" v-model="startDate" required>
      </div>
      <div class="col-6">
        <label for="endDate" class="form-label fw-bold">End Date</label>
        <input id="endDate" type="date" class="form-control" v-model="endDate" required>
      </div>
      <div class="col-12 text-center">
        <button type="submit" class="btn btn-success">Generate CSV</button>
      </div>
    </form>
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
import { fetchWrapperJSON } from '@/api_wrapper';


export default {
  name: "FinancialsExport",
  data() {
    return {
      committeeList: {},
      committee: '',
      startDate: '',
      endDate: '',
      error: false,
      dispmsg: ''
    }
  },
  async mounted() {
    const response = await fetchWrapperJSON(`/api/v2/account/${auth_state.state.uname}/committees?readonly=yes`, {
      method: 'get',
    });

    if (response.error) {
      this.error = true;
      this.dispmsg = response.response;
      return;
    }

    this.committeeList = response.response;
  },
  methods: {
    async getCSV() {
      window.open(`/api/v2/committee/${this.committee}/csv?start=${this.startDate}&end=${this.endDate}`, "_blank");
    }
  }
}
</script>
