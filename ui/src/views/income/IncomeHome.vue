<template>
  <div>
    <h3>Create Donation</h3>
    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>
    <form v-on:submit.prevent="submitIncome()" class="row g-3 text-start">
      <div class="col-md-12">
        <label for="committeeSelect" class="form-label fw-bold">Committee</label>
        <select id="committeeSelect" class="form-select" v-model="committee" required>
          <option selected disabled value="">Select...</option>
          <option v-for="(val,com) in committeeList" v-bind:key="com" v-bind:value="com">{{val[1]}}</option>
        </select>
      </div>
      <div class="col-12">
        <label for="sourceName" class="form-label fw-bold">Source</label>
        <input id="sourceName" type="text" class="form-control" placeholder="Provost, PESC, Northrop, etc." v-model="source" required>
      </div>
      <div class="col-md-6">
        <label for="amountDollars" class="form-label fw-bold">Amount</label>
        <div class="input-group">
          <span class="input-group-text">$</span>
          <input id="amountDollars" type="number" step=".01" class="form-control" placeholder="1500.00" v-model="amount" required>
        </div>
      </div>
      <div class="col-md-6">
        <label for="itemName" class="form-label fw-bold">Item (Optional)</label>
        <input id="itemname" type="text" class="form-control" placeholder="If item donation, list item" v-model="item">
      </div>
      <div class="col-md-6">
        <label for="typeSelect" class="form-label fw-bold">Type</label>
        <select id="typeSelect" class="form-select" v-model="type" required>
          <option selected disabled value="">Select...</option>
          <option>BOSO</option>
          <option>Cash</option>
          <option>Discount</option>
          <option>SOGA</option>
        </select>
      </div>
      <div class="col-md-6">
        <label for="statusSelect" class="form-label fw-bold">Status</label>
        <select id="statusSelect" class="form-select" v-model="status" required>
          <option selected>Expected</option>
          <option>Received</option>
          <option>Unreceived</option>
        </select>
      </div>
      <div class="col-12">
        <label for="commentsField" class="form-label fw-bold">Comments (Optional)</label>
        <textarea id="commentsField" type="text" class="form-control" v-model="comments"></textarea>
      </div>
      <div class="col-12 text-center">
        <button type="submit" class="btn btn-success">Create Donation</button>
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
import { fetchWrapperJSON, fetchWrapperTXT } from '@/api_wrapper';

export default {
  name: 'IncomeHome',
  data() {
    return {
      dispmsg: '',
      error: false,
      committeeList: [],
      committee: '',
      source: '',
      amount: '',
      item: '',
      type: '',
      status: 'Expected',
      comments: '',
    }
  },
  methods: {
    async submitIncome() {
      this.dispmsg = '';

      const response = await fetchWrapperTXT(`/api/v2/income`, {
        method: 'post',
        credentials: 'include',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({committee:this.committeeList[this.committee][0],source:this.source,item:this.item,
                              amount:this.amount,status:this.status,type:this.type,comments:this.comments}),
      });

      this.error = response.error;
      this.dispmsg = response.response;

      if (!response.error) {
        this.committee = '';
        this.source = '';
        this.amount = '';
        this.item = '';
        this.type = '';
        this.status = 'Expected';
        this.comments = '';
      }
    }
  },
  async mounted() {
    const response = await fetchWrapperJSON(`/api/v2/account/${auth_state.state.uname}/committees`, {
      method: 'get',
      credentials: 'include',
    });

    if (response.error) {
      this.error = true;
      this.dispmsg = response.response;
      return;
    }

    this.committeeList = response.response;
  }
}
</script>
