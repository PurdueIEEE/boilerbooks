<template>
  <div>
    <h3>Add/Modify Committee Budgets</h3>
    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>
    <div class="row g-3 text-start">
      <div class="col-md-12">
        <label for="committeeSelect" class="form-label fw-bold">Committee</label>
        <select id="committeeSelect" class="form-select" v-model="committee">
          <option selected disabled value="">Select...</option>
          <option v-for="(val,com) in committeeList" v-bind:key="com" v-bind:value="com">{{val}}</option>
        </select>
      </div>
    </div>
    <div class="my-3" v-if="committee!==''">
      <p class="fs-2">Current total budget: <span class="fw-bold">${{currBudgetTotal.toFixed(2)}}</span></p>
      <p class="fs-2">Current budget status: <span v-bind:class="budgetStatus()">{{financialSummary.length == 0 ? "Not Submitted" : financialSummary[0].budget}}</span></p>
      <form v-on:submit.prevent="pushNewBudget">

        <div v-for="(item, idx) in currBudget" v-bind:key="item.category" class="p-3 m-2 bg-light border rounded-3 row text-start">
          <div class="col-md-5 mt-1">
            <label v-bind:for="'cat-input-'+idx" class="form-label fw-bold">Category</label>
            <input v-bind:id="'cat-input-'+idx" type="text" v-model="currEditBudget[idx].category" class="form-control" required>
          </div>
          <div class="col-md-5 mt-1">
            <label v-bind:for="'amt-input-'+idx" class="form-label fw-bold">Amount</label>
            <div class="input-group">
              <span class="input-group-text">$</span>
              <input v-bind:id="'amt-input-'+idx" type="number" v-model="currEditBudget[idx].amount" class="form-control" required>
            </div>
          </div>
          <div class="col-md-2 d-flex align-items-center justify-content-center">
            <button class="btn btn-danger p-2 m-1" v-on:click="removeLineItem(idx)"><i class="bi bi-trash-fill"></i>Delete</button>
          </div>
        </div>

        <div class="p-3 m-2 bg-light border rounded-3 row text-start">
          <div class="col-md-5 mt-1">
            <label for="cat-input-new" class="form-label fw-bold">Category</label>
            <input id="cat-input-new" type="text" v-model="newCat" class="form-control" placeholder="Category name...">
          </div>
          <div class="col-md-5 mt-1">
            <label for="amt-input-new" class="form-label fw-bold">Amount</label>
            <div class="input-group">
              <span class="input-group-text">$</span>
              <input id="amt-input-new" type="number" step=".01" class="form-control" placeholder="Category amount..." v-model="newAmt">
            </div>
          </div>
          <div class="col-md-2 d-flex align-items-center justify-content-center">
            <button class="btn btn-success p-2 m-1" type="button" v-on:click="addNewLineItem"><i class="bi bi-plus-lg"></i>Add</button>
          </div>
        </div>

        <button class="btn btn-primary mt-3" type="submit">Submit Budget</button>
      </form>
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

import auth_state from '@/state';
import { fetchWrapperJSON, fetchWrapperTXT } from '@/api_wrapper';

export default {
  name: 'BudgetModify',
  data() {
    return {
      dispmsg: '',
      error: false,
      committee: '',
      committeeList: [],
      currBudget: [],
      currEditBudget: [],
      financialSummary: [],
      newCat: '',
      newAmt: '',
    }
  },
  methods: {
    budgetStatus() {
      if (this.financialSummary.length == 0) {
        return {'text-danger':true, 'fw-bold':true, 'text-decoration-underline':true};
      }

      return {'text-success':this.financialSummary[0].budget==='Approved'}
    },
    addNewLineItem() {
      if (this.newCat === '' || this.newAmt === '') {
        return;
      }
      this.currBudget.push({category:this.newCat, amount:this.newAmt});
      this.currEditBudget.push({category:this.newCat, amount:this.newAmt});
      this.newCat = '';
      this.newAmt = '';
    },
    removeLineItem(idx) {
      this.currBudget.splice(idx, 1);
      this.currEditBudget.splice(idx, 1);
    },
    async pushNewBudget() {
      this.dispmsg = '';
      const response = await fetchWrapperTXT(`/api/v2/budgets/${this.committee}`, {
        method: 'post',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify(this.currEditBudget), // dump the entire budget and let the API deal with it
      });

      this.error = response.error;
      this.dispmsg = response.response;

      if (!response.error) {
        this.committee = '';
      }
    }
  },
  async mounted() {
    const response = await fetchWrapperJSON(`/api/v2/account/${auth_state.state.uname}/committees`, {
      method: 'get',
    });

    if (response.error) {
      this.error = true;
      this.dispmsg = response.response;
      return;
    }

    this.committeeList = response.response;
  },
  computed: {
    currBudgetTotal() {
      let temp_sum = 0.0;
      for(let budgetItem of this.currEditBudget) {
        temp_sum += parseFloat(budgetItem.amount);
      }
      return temp_sum;
    }
  },
  watch: {
    async committee(newVal) {
      if (this.committee === '') {
        return;
      }

      const response = await fetchWrapperJSON(`/api/v2/committee/${newVal}/summary`, {
        method: 'get',
      });

      if (response.error) {
        return;
      }

      this.currBudget = JSON.parse(JSON.stringify(response.response));
      this.currEditBudget = JSON.parse(JSON.stringify(response.response));
      this.financialSummary = response.response;
    }
  }
}
</script>
