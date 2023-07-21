<template>
  <div>
    <h3>View Fiscal Years</h3>
    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>

    <div class="row">
      <div v-for="(item, idx) in fiscalYearList" v-bind:key="idx" class="col-md-4">
        <div class="row p-3 m-2 bg-light-subtle border rounded-3 text-start">
          <div class="col-md-2">
            <p class="fs-5 fw-bold">{{ item.fyid }}</p>
          </div>
          <div class="col-md-8">
            <p class="fs-5 fw-bold">{{ item.fiscal_year }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="row p-3 m-2 bg-light-subtle border rounded-3 text-start">
      <div class="offset-md-2 col-md-4 my-3">
        <input id="fiscal-input-new" type="text" v-model="new_fiscalyear" class="form-control" placeholder="20XX-20YY">
      </div>
      <div class="col-md-4 text-center my-3">
        <button  v-on:click="addNew" class="btn btn-success"><i class="bi bi-plus-lg"></i> Add Next Fiscal Year</button>
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

import { fetchWrapperJSON, fetchWrapperTXT } from '@/api_wrapper';

export default {
  name: 'InfraFiscal',
  data() {
    return {
      dispmsg: '',
      error: false,
      fiscalYearList: [],
      new_fiscalyear: ''
    }
  },
  mounted() {
      this.init();
  },
  methods: {
    async init() {
      const response = await fetchWrapperJSON('/api/v2/infra/fiscal', {
        method: 'get'
      });

      if (response.error) {
        this.error = true;
        this.dispmsg = response.response;
        return;
      }

      this.fiscalYearList = response.response;
    },
    async addNew() {
      const response = await fetchWrapperTXT(`/api/v2/infra/fiscal`, {
        method: 'post',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({fiscal_year: this.new_fiscalyear}),
      });

      this.error = response.error;
      this.dispmsg = response.response;

      if (!this.error) {
        this.init();
      }
    }
  }
}
</script>
