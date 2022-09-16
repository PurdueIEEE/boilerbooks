<template>
  <div class="">
    <h1>Register Your Boiler Books Account</h1>
      <div v-if="error" class="lead fw-bold my-1 fs-3 text-danger">{{errmsg}}</div>
      <div class="row">
        <div class="col-md-6 offset-md-3 text-start p-4">
          <form class="row g-3" v-on:submit.prevent="newAccount()" name="new_form">
            <div class="col-md-6">
              <label for="new_fname" class="form-label">First name</label>
              <input type="text" class="form-control" id="new_fname" v-bind:value="oidc_api_info.given_name" placeholder="Purdue" disabled>
            </div>
            <div class="col-md-6">
              <label for="new_lname" class="form-label">Last Name</label>
              <input type="text" class="form-control" id="new_lname" v-bind:value="oidc_api_info.family_name" placeholder="Pete" disabled>
            </div>
            <div class="col-md-6">
              <label for="new_email" class="form-label">Email</label>
              <input type="email" class="form-control" id="new_email" v-bind:value="oidc_api_info.email" placeholder="ppete@purdue.edu" disabled>
            </div>
            <div class="col-md-6">
              <label for="new_uname" class="form-label">Username</label>
              <input type="text" class="form-control" id="new_uname" v-bind:value="(oidc_api_info.email ?? '').split('@')[0]" placeholder="ppete" disabled>
            </div>
            <div class="col-12">
              <label for="new_address" class="form-label">US Mailing Address</label>
              <input type="text" class="form-control" id="new_address" v-model="new_address" placeholder="610 Purdue Mall" required>
            </div>
            <div class="col-md-6">
              <label for="new_city" class="form-label">City</label>
              <input type="text" class="form-control" id="new_city" v-model="new_city" placeholder="West Lafayette" required>
            </div>
            <div class="col-md-3">
              <label for="new_state" class="form-label">State</label>
              <input type="text" class="form-control" id="new_state" v-model="new_state" placeholder="IN" required>
            </div>
            <div class="col-md-3">
              <label for="new_zip" class="form-label">Zip</label>
              <input type="text" class="form-control" id="new_zip" v-model="new_zip" placeholder="47907" required>
            </div>
            <div class="col-12">
              <label for="new_pin" class="form-label">IEEE Code</label>
              <input type="password" class="form-control" id="new_pin" v-model="new_pin" placeholder="Enter the code given by IEEE to enable account creation" required>
            </div>
            <div class="text-center text-danger">
              <p v-if="showCapsWarning">Caps Lock is on!</p>
            </div>
            <div class="col-12 mt-4 text-center">
              <button type="submit" class="btn btn-primary">Submit</button>
            </div>
          </form>
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
import auth_state from '@/state';

export default {
  name: 'OIDCRegister',
  data() {
    return {
      error: false,
      errmsg: '',
      oidc_api_info: {},
      showCapsWarning: false,
      new_address: '',
      new_city: '',
      new_state: '',
      new_zip: '',
      new_pin: '',
    }
  },
  created() {
    window.addEventListener('keyup', (e) => {
      // If any input is highlighted, this will always trigger as 'true'
      //  even if CapsLock is being depressed. I can not figure out a good way to
      //  prevent this.
      this.showCapsWarning = e.getModifierState('CapsLock');
    });
  },
  async mounted() {
    const response = await fetchWrapperJSON('/api/v2/oidc/userinfo', {
      method: 'get',
    });

    if (response.error) {
      this.error = true;
      this.errmsg = response.response;
      return;
    }

    this.oidc_api_info = response.response;
  },
  methods: {
    async newAccount() {
      if (this.new_state.length !== 2) {
        this.errmsg = "State must be a 2 letter abbreviation";
        this.error = true;
        return;
      }

      this.error = false;
      const response = await fetchWrapperJSON(`/api/v2/oidc/register`, {
        method: 'post',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({address:this.new_address,city:this.new_city,
                              state:this.new_state,zip:this.new_zip,createpin:this.new_pin}),
      });

      if (response.error) {
        this.error = true;
        this.errmsg = response.response;
        return;
      } else {
        auth_state.newAuthState(response.response);
        if (this.$route.query.returnto === undefined) {
          this.$router.push('/');
        } else {
          this.$router.push(this.$route.query.returnto);
        }
      }
    },
  }
}
</script>
