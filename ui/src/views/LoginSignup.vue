<template>
  <div class="container-lg my-5 pt-5">

    <div v-if="login_status">
      <h1>Please Sign In</h1>
      <div v-if="error" class="lead fw-bold my-1 fs-3 text-danger">{{errmsg}}</div>
      <form v-on:submit.prevent="login()" name="login_form">
        <div class="row">
          <div class="offset-md-4 col-md-4 text-start p-4">
            <label for="login_uname" class="form-label">Username:</label>
            <br>
            <input type="text" name="login_uname" id="login_uname" class="form-control" v-model="login_uname" required>
            <br>
            <label for="login_pass" class="form-label">Password:</label>
            <br>
            <input type="password" name="login_pass" id="login_pass" class="form-control" v-model="login_pass" required>
          </div>
        </div>
        <div class="text-danger">
          <p v-if="showCapsWarning">Caps Lock is on!</p>
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
      <div class="mt-3">
        <button class="btn btn-link"><router-link to="/forgot?type=user" class="link-secondary">Forgot Username</router-link></button>
        <button class="btn btn-link"><router-link to="/forgot?type=pass" class="link-secondary">Forgot Password</router-link></button>
      </div>
      <button class="btn btn-link link-secondary mt-4 fw-bold" v-on:click="swapLoginNew">Make an account</button>
    </div>

    <div v-else>
      <h1>Make a Boiler Books Account</h1>
      <div v-if="error" class="lead fw-bold my-1 fs-3 text-danger">{{errmsg}}</div>
      <div class="row">
        <div class="col-md-6 offset-md-3 text-start p-4">
          <form class="row g-3" v-on:submit.prevent="newAccount()" name="new_form">
            <div class="col-md-6">
              <label for="new_fname" class="form-label">First name</label>
              <input type="text" class="form-control" id="new_fname" v-model="new_fname" placeholder="Purdue" required>
            </div>
            <div class="col-md-6">
              <label for="new_lname" class="form-label">Last Name</label>
              <input type="text" class="form-control" id="new_lname" v-model="new_lname" placeholder="Pete" required>
            </div>
            <div class="col-md-6">
              <label for="new_email" class="form-label">Email</label>
              <input type="email" class="form-control" id="new_email" v-model="new_email" placeholder="ppete@purdue.edu" required>
            </div>
            <div class="col-md-6">
              <label for="new_uname" class="form-label">Username</label>
              <input type="text" class="form-control" id="new_uname" v-model="new_uname" placeholder="ppete" required>
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
              <label for="new_pass1" class="form-label">Password</label>
              <input type="password" class="form-control" id="new_pass1" v-model="new_pass1" placeholder="********" required>
            </div>
            <div class="col-12">
              <label for="new_pass2" class="form-label">Retype Password</label>
              <input type="password" class="form-control" id="new_pass2" v-model="new_pass2" placeholder="********" required>
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
      <button class="btn btn-link link-secondary mt-4 fw-bold" v-on:click="swapLoginNew">I already have an account</button>
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
import {fetchWrapperJSON} from '@/api_wrapper';

export default {
  name: 'LoginSignup',
  data() {
    return {
      login_status: true,
      login_uname: '',
      login_pass: '',
      new_fname: '',
      new_lname: '',
      new_email: '',
      new_address: '',
      new_city: '',
      new_state: '',
      new_zip: '',
      new_uname: '',
      new_pass1: '',
      new_pass2: '',
      new_pin: '',
      error: false,
      errmsg: '',
      showCapsWarning: false,
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
  mounted() {
    let user = null;
    if (document.cookie.split(';').some((item) => item.trim().startsWith('apikey='))) {
      user = JSON.parse(localStorage.getItem('authState'));
    }
    if (user !== null) {
      auth_state.setAuthState(user);
      this.$router.replace('/');
    }
  },
  methods: {
    async login() {
      this.error = false;
      const response = await fetchWrapperJSON('/api/v2/login/password', {
        method: 'post',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({uname:this.login_uname, pass:this.login_pass}),
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
    async newAccount() {
      if (this.new_pass1 !== this.new_pass2) {
        this.errmsg = "Passwords do not match";
        this.error = true;
        return;
      }

      if (this.new_pass1.length < 8) {
        this.errmsg = "Password must be at least 8 characters";
        this.error = true;
        return;
      }

      if (this.new_state.length !== 2) {
        this.errmsg = "State must be a 2 letter abbreviation";
        this.error = true;
        return;
      }

      this.error = false;
      const response = await fetchWrapperJSON(`/api/v2/login`, {
        method: 'post',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({fname:this.new_fname,lname:this.new_lname,uname:this.new_uname,
                              email:this.new_email,address:this.new_address,city:this.new_city,
                              state:this.new_state,zip:this.new_zip,pass1:this.new_pass1,pass2:this.new_pass2,
                              createpin:this.new_pin}),
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
    swapLoginNew() {
      this.login_status = !this.login_status;
      this.error = false;
    }
  }
}
</script>
