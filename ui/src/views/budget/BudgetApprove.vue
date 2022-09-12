<template>
  <div>
    <h3>Approve Committee Budgets</h3>
    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>
    <div class="my-3 row justify-content-center">
      <div v-for="(items, comm) in submittedBudgets" v-bind:key="comm" class="p-3 m-2 bg-light border rounded-3 row text-start col-md-10">
        <p class="fs-2 fw-bold">{{committeeList[comm][1]}}</p>
        <ul>
          <li v-for="item in items" v-bind:key="comm+item.category" class="fs-2 ms-5">{{item.category}} - <span class="fw-bold">${{item.amount}}</span></li>
        </ul>
        <button class="btn btn-success" v-on:click="approveBudget(comm)">Approve</button>
      </div>
      <p v-if="Object.keys(submittedBudgets).length === 0" class="fs-3 lead">All budgets approved.</p>
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
  name: 'BudgetApprove',
  data() {
    return {
      dispmsg: '',
      error: false,
      submittedBudgets: {},
      committeeList: {},
    }
  },
  async mounted() {
    const response = await fetchWrapperJSON(`/api/v2/committee`, {
      method: 'get',
    });

    if (response.error) {
      this.error = true;
      this.dispmsg = response.response;
      return;
    }

    this.committeeList = response.response;
    this.init();
  },
  methods: {
    async approveBudget(comm) {
      const response = await fetchWrapperTXT(`/api/v2/budgets/${comm}`, {
        method: 'put',
      });

      this.error = response.error;
      this.dispmsg = response.response;

      if (!response.error) {
        this.init();
      }
    },
    async init() {
      const response = await fetchWrapperJSON(`/api/v2/budgets/submitted`, {
        method: 'get',
      });

      if (response.error) {
        this.error = true;
        this.dispmsg = response.response;
        return;
      }

      let filtered_response = {}
      for (let committee in response.response) {
        if (response.response[committee].length !== 0) {
          filtered_response[committee] = response.response[committee];
        }
      }
      this.submittedBudgets = filtered_response;
    }
  }
}
</script>
