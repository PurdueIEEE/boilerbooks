<template>
  <div class="container-lg my-5 pt-5">
    <h1>Change Password</h1>

    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <div v-if="passerr" class="lead fw-bold my-1 fs-3 text-danger">Passwords do not match!</div>
    <br v-else>

    <!--<div class="row my-2">
      <div class="text-end col-md-4">
        <h4>Current Password</h4>
      </div>
      <div class="col-md-8">
        <input class="form-control" type="password" placeholder="********" v-model="current">
      </div>
    </div>-->

    <div class="row my-2">
      <div class="text-end col-md-4">
        <h4>New Password</h4>
      </div>
      <div class="col-md-8">
        <input class="form-control" type="password" placeholder="********" v-model="new_pass">
      </div>
    </div>

    <div class="row my-2">
      <div class="text-end col-md-4">
        <h4>Retype New Password</h4>
      </div>
      <div class="col-md-8">
        <input class="form-control" type="password" placeholder="********" v-model="new_pass_again">
      </div>
    </div>

    <button class="btn btn-primary mt-2 mx-1" v-on:click="changePassword">Change Password</button>
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

export default {
  name: 'Account',
  data() {
    return {
      current: '',
      new_pass: '',
      new_pass_again: '',
      dispmsg: '',
      error: false,
    }
  },
  computed: {
    passerr() {
      if(this.new_pass === '' || this.new_pass_again === '') return;
      return this.new_pass !== this.new_pass_again;
    }
  },
  methods: {
    changePassword() {
      if (this.new_pass !== this.new_pass_again) {
        return;
      }

      this.dispmsg = '';
      fetch(`/api/v2/account/${auth_state.state.uname}`, {
        method: 'post',
        credentials: 'include',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({uname:auth_state.state.uname,pass1:this.new_pass,pass2:this.new_pass_again}),
      })
      .then((response) => {
        // API key must have expired
        if (response.status === 401) {
          auth_state.clearAuthState();
          this.$router.replace('/login');
          return response.text()
        }
        this.error = !response.ok;
        return response.text();
      })
      .then((response) => {
        this.dispmsg = response;
        //setTimeout(() => {this.dispmsg = '';}, 2000);
      })
      .catch((error) => {
        console.log(error);
      });
    }
  },
}
</script>
