<template>
  <div>
    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>

    <h3>Current Treasurers</h3>
    <table class="table table-hover table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Username</th>
          <th>Position</th>
          <th>Remove?</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in treasurerList" v-bind:key="user.username">
          <td>{{user.name}}</td>
          <td>{{user.username}}</td>
          <td>{{user.role}}</td>
          <td><button class="btn btn-danger" v-on:click="remove(user.username)">Remove</button></td>
        </tr>
      </tbody>
    </table>
    <br><br>
    <h3>Add New Treasurer</h3>
    <form v-on:submit.prevent="create()" class="row g-3 text-start">
      <div class="col-md-6">
        <label for="nameInput" class="form-label fw-bold">Username</label>
        <input id="nameInput" type="text" class="form-control" placeholder="Enter their Boiler Books username..." v-model="username" required>
      </div>
      <div class="col-md-6">
        <label for="roleInput" class="form-label fw-bold">Role</label>
        <input id="roleInput" type="text" class="form-control" placeholder="treasurer, president, etc..." v-model="role" required>
      </div>
      <div class="col-md-12 text-center">
        <button type="submit" class="btn btn-success">Add Treasurer</button>
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

import { fetchWrapperJSON, fetchWrapperTXT } from '@/api_wrapper';

export default {
  name: 'AccessTreasurers',
  data() {
    return {
      error: false,
      dispmsg: '',
      treasurerList: [],
      username: '',
      role: '',
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      const response = await fetchWrapperJSON(`/api/v2/access/treasurers`, {
        method: 'get',
        credentials: 'include',
      });

      if (response.error) {
        this.error = true;
        this.dispmsg = response.response;
        return;
      }

      this.treasurerList = response.response;
    },
    async remove(username) {
      const response = await fetchWrapperTXT(`/api/v2/access/treasurer/${username}`, {
        method: 'delete',
        credentials: 'include',
      });

      this.error = response.error;
      this.dispmsg = response.response;
      this.init();
    },
    async create() {
      const response = await fetchWrapperTXT(`/api/v2/access/treasurers`, {
        method: 'post',
        credentials: 'include',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({username:this.username,role:this.role}),
      });

      this.error = response.error;
      this.dispmsg = response.response;

      if (!response.error) {
        this.username = '';
        this.role = '';
        this.init();
      }
    }
  }
}
</script>
