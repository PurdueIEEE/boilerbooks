<template>
  <div class="container-lg my-5 pt-5">
    <h1>Boiler Books Account Details</h1>

    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>

    <div class="row my-2">
      <div class="text-end col-md-4">
        <h4>Current First Name</h4>
      </div>
      <div class="col-md-8">
        <input class="form-control" v-model="fname">
      </div>
    </div>

    <div class="row my-2">
      <div class="text-end col-md-4">
        <h4>Current Last Name</h4>
      </div>
      <div class="col-md-8">
        <input class="form-control" v-model="lname">
      </div>
    </div>

    <div class="row my-2">
      <div class="text-end col-md-4">
        <h4>Current Email</h4>
      </div>
      <div class="col-md-8">
        <input class="form-control" v-model="email">
      </div>
    </div>

    <div class="row my-2">
      <div class="text-end col-md-4">
        <h4>Current Address</h4>
      </div>
      <div class="col-md-8">
        <input class="form-control" v-model="address">
      </div>
    </div>

    <div class="row my-2">
      <div class="text-end col-md-4">
        <h4>Current City</h4>
      </div>
      <div class="col-md-8">
        <input class="form-control" v-model="city">
      </div>
    </div>

    <div class="row my-2">
      <div class="text-end col-md-4">
        <h4>Current State</h4>
      </div>
      <div class="col-md-8">
        <input class="form-control" v-model="state">
      </div>
    </div>

    <div class="row my-2">
      <div class="text-end col-md-4">
        <h4>Current Zip Code</h4>
      </div>
      <div class="col-md-8">
        <input class="form-control" v-model="zip">
      </div>
    </div>

    <button class="btn btn-primary mt-2 mx-1" v-on:click="updateAccount">Update Account Details</button>
    <button class="btn btn-secondary mt-2 mx-1" v-on:click="changePassword">Change Password</button>

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
  name: 'AccountSettings',
  data() {
    return {
      fname: '',
      lname: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      dispmsg:'',
      error:false,
    }
  },
  methods: {
    async updateAccount() {
      const response = await fetchWrapperTXT(`/api/v2/account/${auth_state.state.uname}`, {
        method: 'put',
        credentials: 'include',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({uname:auth_state.state.uname,fname:this.fname,lname:this.lname,email:this.email,address:this.address,city:this.city,state:this.state,zip:this.zip}),
      });

      this.error = response.error;
      this.dispmsg = response.response;
    },
    changePassword() {
      this.$router.push('/myaccount/password');
    }
  },
  async mounted() {
    const response = await fetchWrapperJSON(`/api/v2/account/${auth_state.state.uname}`, {
      method: 'get',
      credentials: 'include',
    });

    if (response.error) {
      this.error = true;
      this.dispmsg = response.response;
      return;
    }

    this.fname = response.response.first;
    this.lname = response.response.last;
    this.email = response.response.email;
    this.address = response.response.address;
    this.city = response.response.city;
    this.state = response.response.state;
    this.zip = response.response.zip;
  }
}
</script>