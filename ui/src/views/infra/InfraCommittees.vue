<template>
  <div>
    <h3>Modify Committees</h3>
    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>

    <div class="p-3 m-2 bg-light border rounded-3 row text-start">
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
    <div v-for="(item, idx) in committeeList" v-bind:key="idx" class="p-3 m-2 bg-light border rounded-3 row text-start">
      <div class="col-md-1">
        <p class="fs-5 fw-bold">{{ item.committee_id }}</p>
      </div>
      <div class="col-md-3">
        <p class="fs-5 fw-bold">{{ item.display_name }}</p>
      </div>
      <div class="col-md-2">
        <p class="fs-5 fw-bold">{{ item.api_name }}</p>
      </div>
      <div class="col-md-2">
        <p class="fs-5 fw-bold">{{ item.bank_status }}</p>
      </div>
      <div class="col-md-2">
        <p class="fs-5 fw-bold">{{ item.dues_status }}</p>
      </div>
      <div class="col-md-2">
        <button class="btn btn-secondary"><i class="bi bi-pencil-fill"></i></button>
      </div>
    </div>
    <div class="p-3 m-2 bg-light border rounded-3 row text-start">
      <div class="col-md-1">
        <p class="fs-5 fw-bold">#</p>
      </div>
      <div class="col-md-3">
        <input id="name-input-new" type="text" class="form-control" placeholder="Committee Name...">
      </div>
      <div class="col-md-2">
        <input id="api-input-new" type="text" class="form-control" placeholder="API Key...">
      </div>
      <div class="col-md-2">
        <select id="dues-input-new" class="form-select">
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>
      <div class="col-md-2">
        <select id="dues-input-new" class="form-select">
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>
      <div class="col-md-2">
        <button class="btn btn-success"><i class="bi bi-plus-lg"></i></button>
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

import { fetchWrapperJSON } from '@/api_wrapper';

export default {
  name: 'InfraCommittees',
  data() {
    return {
      dispmsg: '',
      error: false,
      committeeList: [],
    }
  },
  methods: {

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
  }
}
</script>
