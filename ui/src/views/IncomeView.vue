<template>
  <div class="container-lg my-5 pt-5">
    <h1>Income #{{income.incomeid}}</h1>
    <br>
    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>
    <p class="lead">Last Modified at <u>{{localDate}}</u></p>
    <div class="row">
      <!-- This looks misaligned but its actually centered -->
      <div class="col-md-8 offset-md-2">
        <div class="row g-0 text-start">
          <div class="col-md-6 border border-secondary p-3">
            <p class="fs-5">Added By: <span class="fw-bold">{{income.reportedby}}</span></p>
          </div>
          <div class="col-md-6 border border-secondary p-3">
            <p class="fs-5">Income Source: <span class="fw-bold">{{income.source}}</span></p>
          </div>
          <div class="col-md-6 border border-secondary p-3">
            <p class="fs-5">Status: <span class="fw-bold">{{income.status}}</span></p>
          </div>
          <div class="col-md-6 border border-secondary p-3">
            <p class="fs-5">Amount: <span class="fw-bold">${{income.amount}}</span></p>
          </div>
          <div class="col-md-6 border border-secondary p-3">
            <p class="fs-5">Reference Number: <span class="fw-bold">{{income.refnumber}}</span></p>
          </div>
          <div class="col-md-6 border border-secondary p-3">
            <p class="fs-5">Type: <span class="fw-bold">{{income.type}}</span></p>
          </div>
          <div class="col-md-6 border border-secondary p-3">
            <p class="fs-5">Committee: <span class="fw-bold">{{income.committee}}</span></p>
          </div>
          <div class="col-md-6 border border-secondary p-3">
            <p class="fs-5">Item: <span class="fw-bold">{{income.item}}</span></p>
          </div>
          <div class="col-md-6 border border-secondary p-3">
            <p class="fs-5">Fiscal Year: <span class="fw-bold">{{income.fiscal_year}}</span></p>
          </div>
          <div class="col-md-6 border border-secondary p-3">
            <p class="fs-5">Comments: <span class="fw-bold">{{income.comments}}</span></p>
          </div>
        </div>
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

import {fetchWrapperJSON} from '@/api_wrapper';

export default {
  name: 'IncomeView',
  data() {
    return {
      income: {},
      error: false,
      dispmsg: '',
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      if (this.$route.query.id === undefined || this.$route.query.id === '') {
        return;
      }

      const response = await fetchWrapperJSON(`/api/v2/income/${this.$route.query.id}`, {
          method: 'get',
      });

      if (response.error) {
        this.error = true;
        this.dispmsg = response.response;
        return;
      }

      this.income = response.response;
    }
  },
  computed: {
    localDate() {
      if (this.income.mdate === undefined) return "";
      const d = new Date(this.income.mdate);
      return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")} ` +
              `${d.getHours().toString().padStart(2, "0")}:${(d.getMinutes()+1).toString().padStart(2, "0")}:${(d.getSeconds()+1).toString().padStart(2, "0")}`;
    },
  }
}
</script>
