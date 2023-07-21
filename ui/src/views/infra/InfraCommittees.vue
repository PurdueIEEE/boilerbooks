<template>
  <div>
    <h3>Modify Committees</h3>
    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>

    <div class="modal" id="verifyStatusChange" tabindex="-1" aria-labelledby="verifyStatusChange" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="verifyStatusChange">Are you sure?</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p class="fs-5">You have selected to change {{ warning_committee }}'s Finances from "Active" to "Inactive".</p>
            <p class="fs-5">This is a destructive action: users will no longer be able to complete purchase workflows, income workflows, or view financial history.</p>
            <p class="fs-5">While this action is reversible, it may have side effects that may corrupt data.</p>
            <p class="fw-bold fs-4">Are you sure you want to proceed?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Go Back</button>
            <button type="button" class="btn btn-primary" v-on:click="actuallySaveEdit(warning_idx)">Yes, I'm sure!</button>
          </div>
        </div>
      </div>
    </div>

    <div class="p-3 m-2 bg-light-subtle border rounded-3 row text-start">
      <div class="col-md-1">
        <p class="fs-3 fw-bold">ID</p>
      </div>
      <div class="col-md-3">
        <p class="fs-3 fw-bold">Name</p>
      </div>
      <div class="col-md-2">
        <p class="fs-3 fw-bold">API Key</p>
      </div>
      <div class="col-md-2">
        <p class="fs-3 fw-bold">Finances</p>
      </div>
      <div class="col-md-2">
        <p class="fs-3 fw-bold">Dues</p>
      </div>
      <div class="col-md-2">
        <p class="fs-3 fw-bold">Edit</p>
      </div>
    </div>
    <div v-for="(item, idx) in committeeList" v-bind:key="idx" class="p-3 m-2 bg-light-subtle border rounded-3 row text-start">
      <div class="col-md-1">
        <p class="fs-5 fw-bold">{{ item.committee_id }}</p>
      </div>
      <div class="col-md-3">
        <p v-if="!activeEditList[idx]" class="fs-5 fw-bold">{{ item.display_name }}</p>
        <input v-else type="text" v-model="committeeListEdit[idx].display_name" class="form-control" placeholder="Committee Name...">
      </div>
      <div class="col-md-2">
        <p v-if="!activeEditList[idx]" class="fs-5 fw-bold">{{ item.api_name }}</p>
        <input v-else type="text" v-model="committeeListEdit[idx].api_name" class="form-control" placeholder="Committee Name...">
      </div>
      <div class="col-md-2">
        <p v-if="!activeEditList[idx]" class="fs-5 fw-bold">{{ item.bank_status }}</p>
        <select v-else v-model="committeeListEdit[idx].bank_status" class="form-select">
          <option>Active</option>
          <option>Inactive</option>
          <option>Read-Only</option>
        </select>
      </div>
      <div class="col-md-2">
        <p v-if="!activeEditList[idx]" class="fs-5 fw-bold">{{ item.dues_status }}</p>
        <select v-else v-model="committeeListEdit[idx].dues_status" class="form-select">
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>
      <div class="col-md-2">
        <button v-if="!activeEditList[idx]" v-on:click="startEdit(idx)" class="btn btn-secondary"><i class="bi bi-pencil-fill"></i></button>
        <button v-if="activeEditList[idx]" v-on:click="stopEdit(idx)" class="btn btn-danger"><i class="bi bi-x-lg"></i></button>
        <span class="mx-2"></span>
        <button v-if="activeEditList[idx]" v-on:click="saveEdit(idx)" class="btn btn-primary"><i class="bi bi-check-lg"></i></button>
      </div>
    </div>
    <div class="p-3 m-2 bg-light-subtle border rounded-3 row text-start">
      <div class="col-md-1 my-3">
        <p class="fs-5 fw-bold">#</p>
      </div>
      <div class="col-md-3 mt-3">
        <input id="name-input-new" type="text" v-model="new_committee.display_name" class="form-control" placeholder="Committee Name...">
      </div>
      <div class="col-md-2 my-3">
        <input id="api-input-new" type="text" v-model="new_committee.api_name" class="form-control" placeholder="API Key...">
      </div>
      <div class="col-md-2 my-3">
        <select id="dues-input-new" v-model="new_committee.bank_status" class="form-select">
          <option>Active</option>
          <option>Inactive</option>
          <option>Read-Only</option>
        </select>
      </div>
      <div class="col-md-2 my-3">
        <select id="dues-input-new" v-model="new_committee.dues_status" class="form-select">
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>
      <div class="col-md-2 my-3">
        <button  v-on:click="addNew" class="btn btn-success"><i class="bi bi-plus-lg"></i></button>
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
import { Modal } from 'bootstrap';

export default {
  name: 'InfraCommittees',
  data() {
    return {
      dispmsg: '',
      error: false,
      committeeList: [],
      committeeListEdit: [],
      activeEditList: [],
      new_committee: {
        committee_id: 0,
        display_name: '',
        api_name: '',
        bank_status: 'Active',
        dues_status: 'Active',
      },
      warning_modal: null,
      warning_committee: '',
      warning_idx: 0,
    }
  },
  methods: {
    startEdit(idx) {
      this.committeeListEdit[idx] = {... this.committeeList[idx]};
      this.activeEditList[idx] = true;
    },
    stopEdit(idx) {
      this.activeEditList[idx] = false;
    },
    async actuallySaveEdit(idx) {
      this.warning_modal.hide();
      const response = await fetchWrapperTXT(`/api/v2/infra/committees/${this.committeeListEdit[idx].committee_id}`, {
        method: 'put',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify(this.committeeListEdit[idx]),
      });

      this.committeeList[idx] = {... this.committeeListEdit[idx]}; // This performs a deep copy

      this.error = response.error;
      this.dispmsg = response.response;

      if (!this.error) {
        this.stopEdit(idx);
      }
    },
    saveEdit(idx) {
      if (this.committeeListEdit[idx].display_name.length > 20) {
        this.error = true;
        this.dispmsg = "Display Name must be <= 20 characters";
        return;
      }

      if (this.committeeListEdit[idx].api_name.length > 20) {
        this.error = true;
        this.dispmsg = "API Name must be <= 20 characters";
        return;
      }

      // Verify that the user is OK with this destructive action
      if (this.committeeList[idx].bank_status === "Active" && this.committeeListEdit[idx].bank_status === "Inactive") {
        this.warning_committee = this.committeeListEdit[idx].display_name;
        this.warning_idx = idx;
        // Show modal
        this.warning_modal.show();
      } else {
        this.actuallySaveEdit(idx);
      }
    },
    async addNew() {
      if (this.new_committee.display_name.length > 20) {
        this.error = true;
        this.dispmsg = "Display Name must be <= 20 characters";
        return;
      }

      if (this.new_committee.api_name.length > 20) {
        this.error = true;
        this.dispmsg = "API Name must be <= 20 characters";
        return;
      }

      const response = await fetchWrapperTXT(`/api/v2/infra/committees`, {
        method: 'post',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify(this.new_committee),
      });

      this.error = response.error;
      this.dispmsg = response.response;

      if (!this.error) {
        this.committeeList.push({...this.new_committee});
        this.committeeListEdit.push({...this.new_committee});
        this.new_committee = {display_name:'',api_name:'',bank_status:'Active',dues_status:'Active'};
      }
    }
  },
  async mounted() {
    const response = await fetchWrapperJSON('/api/v2/infra/committees', {
      method: 'get'
    });

    if (response.error) {
      this.error = true;
      this.dispmsg = response.response;
      return;
    }

    this.committeeList = response.response;
    this.committeeListEdit = this.committeeList.map((elm) => ({...elm}));  // This performs a deep copy
    this.activeEditList = this.committeeList.map(() => (false));

    this.new_committee.committee_id = this.committeeList[this.committeeList.length - 1].committee_id + 1;

    this.warning_modal = new Modal(document.getElementById("verifyStatusChange"),  {backdrop:'static'});
  }
}
</script>
