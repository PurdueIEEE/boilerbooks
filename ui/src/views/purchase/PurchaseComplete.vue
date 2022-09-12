<template>
  <div >
    <h3>Complete a purchase</h3>
    <p class="lead">Chose a purchase to complete.</p>
    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>

    <select id="currentApproval" class="form-select" v-model="currentComplete">
      <option selected disabled value="">Select...</option>
      <option v-for="purchase in completionList" v-bind:key="purchase.purchaseID" v-bind:value="purchase.purchaseID">{{purchase.item}}</option>
    </select>
    <br><br>
    <form v-on:submit.prevent="completePurchase(currentComplete)" class="row g-3 text-start" v-if="currentComplete !== ''">
      <div class="col-md-6">
        <label for="committeeName" class="form-label fw-bold">Committee</label>
        <h3 id="committeeName">{{purchase.committee}}</h3>
      </div>
      <div class="col-md-6">
        <label for="categoryName" class="form-label fw-bold">Category</label>
        <h3>{{purchase.category}}</h3>
      </div>
      <div class="col-12">
        <label for="itemName" class="form-label fw-bold">Item being Purchased</label>
        <h3 id="itemName">{{purchase.item}}</h3>
      </div>
      <div class="col-md-6">
        <label for="purchaseReason" class="form-label fw-bold">Reason for Purchase</label>
        <h3 id="purchaseReason">{{purchase.purchasereason}}</h3>
      </div>
      <div class="col-md-6">
        <label for="vendorName" class="form-label fw-bold">Vendor</label>
        <h3 id="vendorName">{{purchase.vendor}}</h3>
      </div>
      <div class="col-12">
        <label for="costDollars" class="form-label fw-bold">Cost</label>
        <div class="input-group">
          <span class="input-group-text">$</span>
          <input id="costDollars" type="number" step=".01" class="form-control" v-model="purchase.cost" v-bind:max="purchase.maxCost" required>
        </div>
      </div>
      <div class="col-12">
        <label for="purchaseDate" class="form-label fw-bold">Purchase Date</label>
        <input id="purchaseDate" type="date" class="form-control" v-model="purchasedate" required>
      </div>
      <div class="col-12">
        <label for="receiptFile" class="form-label fw-bold">Receipt File</label>
        <input id="receiptFile" type="file" class="form-control" accept="image/png, image/jpeg, application/pdf" required>
      </div>
      <div class="col-12">
        <label for="commentsField" class="form-label fw-bold">Comments (Optional)</label>
        <textarea id="commentsField" type="text" class="form-control" v-model="purchase.comments"></textarea>
      </div>
      <div class="col-12 text-center">
        <button type="submit" class="btn btn-success">Complete Request</button>
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
import {fetchWrapperJSON, fetchWrapperTXT} from '@/api_wrapper';

const today = new Date();
export default {
  name: 'PurchaseComplete',
  data() {
    return {
      dispmsg: '',
      error: false,
      completionList: [],
      currentComplete: '',
      purchasedate: `${today.getFullYear()}-${(today.getMonth()+1).toString().padStart(2,'0')}-${(today.getDate()).toString().padStart(2,'0')}`,
      purchase: {committee: '',category: '',item: '',purchasereason: '',vendor: '',cost: '',maxCost: '',comments: ''},
    }
  },
  methods: {
    async completePurchase(id) {
      this.dispmsg = '';

      const formData = new FormData();

      const fileInput = document.querySelector("#receiptFile");

      formData.append('price', this.purchase.cost);
      formData.append('purchasedate', this.purchasedate);
      formData.append('comments', this.purchase.comments);
      formData.append('receipt', fileInput.files[0]);

      const response = await fetchWrapperTXT(`/api/v2/purchase/${id}/complete`, {
        method: 'post',
        headers: new Headers({}),
        body: formData,
      });

      this.error = response.error;
      this.dispmsg = response.response;

      if (!response.error) {
        this.currentComplete = '';
        this.init();
      }
    },

    async init() {
      const response = await fetchWrapperJSON(`/api/v2/account/${auth_state.state.uname}/completions`, {
        method: 'get',
      });

      if (response.error) {
        this.error = true;
        this.dispmsg = response.response;
        return;
      }

      this.completionList = response.response;
    }
  },
  mounted() {
    this.init();
  },
  watch: {
    async currentComplete(newVal) {
      if (newVal === '') {
        this.purchase = {committee: '',category: '',item: '',purchasereason: '',vendor: '',cost: '',maxCost: '',comments: ''};
        return;
      }

      this.dispmsg = '';
      const response = await fetchWrapperJSON(`/api/v2/purchase/${newVal}`, {
        method: 'get',
      });

      if (response.error) {
        this.error = true;
        this.dispmsg = response.response;
        this.purchase = {committee: '',category: '',item: '',purchasereason: '',vendor: '',cost: '',maxCost: '',comments: ''};
        return;
      }

      this.purchase = response.response;
    }
  }
}
</script>
