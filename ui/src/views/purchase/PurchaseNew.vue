<template>
  <div>
    <h3>Request a New Purchase</h3>
    <p class="lead">Fill out the details below to create a new purchase request.</p>
    <div v-if="dispmsg!==''" style="white-space: pre-wrap;" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>

    <div class="modal" id="checkTypeModal" tabindex="-1" aria-labelledby="checkTypeModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="checkTypeModalLabel">Are you sure?</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p class="fs-5">You have selected to have your check mailed to the address on your account. Make sure this is a valid address where you can receive mail.</p>
            <p class="fs-5">Mailing your check can cause your reimbursement to be delayed by several weeks. If you are on campus, picking up your check from the IEEE office is significantly quicker.</p>
            <p class="fs-5">Further, the IEEE Treasurer can, at their discretion, choose to not follow your request.</p>
            <p class="fw-bold fs-4">Are you sure you want to proceed?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Go Back</button>
            <button type="button" class="btn btn-primary" v-on:click="submitRequest(false)">Yes, I'm sure!</button>
          </div>
        </div>
      </div>
    </div>

    <form v-on:submit.prevent="submitRequest(this.checkType === 'Mailed')" class="row g-3 text-start">
      <div class="col-md-6">
        <label for="committeeSelect" class="form-label fw-bold">Committee</label>
        <select id="committeeSelect" class="form-select" v-model="committee" required>
          <option selected disabled value="">Select...</option>
          <option v-for="(val,com) in committeeList" v-bind:key="com" v-bind:value="com">{{val[1]}}</option>
        </select>
      </div>
      <div class="col-md-6">
        <label for="categorySelect" class="form-label fw-bold">Category</label>
        <select id="categorySelect" class="form-select" v-model="category" required>
          <option selected disabled value="">Select...</option>
          <option v-for="cat in categoryList" v-bind:key="cat.category">{{cat.category}}</option>
        </select>
      </div>
      <div class="col-12">
        <label for="itemName" class="form-label fw-bold">Item to Purchase</label>
        <input id="itemName" type="text" class="form-control" placeholder="Resistor, Screws, etc." v-model="itemName" required>
      </div>
      <div class="col-12">
        <label for="purchaseReason" class="form-label fw-bold">Reason for Purchase</label>
        <input id="purchaseReason" type="text" class="form-control" placeholder="For testing, building claw, etc." v-model="itemReason" required>
      </div>
      <div class="col-12">
        <label for="vendorName" class="form-label fw-bold">Vendor</label>
        <input id="vendorName" type="text" class="form-control" placeholder="Digikey, Amazon, etc." v-model="vendor" required>
      </div>
      <div class="col-md-6">
        <label for="costDollars" class="form-label fw-bold">Cost</label>
        <div class="input-group">
          <span class="input-group-text">$</span>
          <input id="costDollars" type="number" step=".01" class="form-control" placeholder="123.45" v-model="price" required>
        </div>
      </div>
      <div class="col-md-6">
        <label for="checkSelect" class="form-label fw-bold">How would you like to receive this check?</label>
        <select id="checkSelect" class="form-select" v-model="checkType" required>
          <option selected disabled value="">Select...</option>
          <option value="Pick-up">Pickup From Office</option>
          <option value="Mailed">Mailed to Address</option>
        </select>
      </div>
      <div class="col-12">
        <label for="commentsField" class="form-label fw-bold">Comments (Optional)</label>
        <textarea id="commentsField" type="text" class="form-control" v-model="comments"></textarea>
      </div>
      <div class="col-12 text-center">
        <button type="submit" class="btn btn-success">Submit Request</button>
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

import {fetchWrapperJSON, fetchWrapperTXT} from '@/api_wrapper';
import auth_state from '@/state';
import { Modal } from 'bootstrap';

export default {
  name: 'PurchaseNew',
  data() {
    return {
      committeeList: [],
      committee: '',
      category: '',
      itemName: '',
      itemReason: '',
      vendor: '',
      price: '',
      checkType: '',
      comments: '',
      error: false,
      dispmsg: '',
      categoryList: [],
      checkTypeModal: null,
    }
  },
  methods: {
    async submitRequest(withWarning) {
      if (withWarning) {
        this.checkTypeModal.show();
        return;
      }

      // We have confirmed the check status
      if (this.checkType === 'Mailed') {
        this.checkTypeModal.hide();
      }

      this.dispmsg = '';
      const response = await fetchWrapperTXT(`/api/v2/purchase`, {
        method: 'post',
        credentials: 'include',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({committee:this.committeeList[this.committee][0],category:this.category,item:this.itemName,
                              reason:this.itemReason,vendor:this.vendor,price:this.price,comments:this.comments,checkType:this.checkType}),
      });

      this.error = response.error;
      this.dispmsg = response.response;

      if (!response.error) {
        this.category = '';
        this.itemName = '';
        this.itemReason = '';
        this.vendor = '';
        this.price = '';
        this.comments = '';
        this.checkType = '';
      }
    }
  },
  async mounted() {
    const response_comm = await fetchWrapperJSON(`/api/v2/committee`, {
      method: 'get',
      credentials: 'include',
    });

    const response_lastcomm = await fetchWrapperTXT(`/api/v2/account/${auth_state.state.uname}/committee/purchases`, {
      method: 'get',
      credentials: 'include',
    });

    if (response_comm.error || response_lastcomm.error) {
      this.error = true;
      this.dispmsg = response_comm.response;
      return;
    }

    this.committeeList = response_comm.response;
    this.committee = response_lastcomm.response;
    this.checkTypeModal = new Modal(document.getElementById('checkTypeModal'), {backdrop:'static'});
  },
  watch: {
    async committee(newVal) {
      this.category = '';
      if (this.committee === '') return;

      const response = await fetchWrapperJSON(`/api/v2/committee/${newVal}/categories`, {
        method: 'get',
        credentials: 'include',
      });

      if (response.error) {
        this.error = true;
        this.dispmsg = response.response;
        return;
      }

      this.categoryList = response.response;
    }
  }
}
</script>
