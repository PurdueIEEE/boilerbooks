<template>
  <div class="container-lg my-5 pt-5">
    <div v-if="$route.query.type === 'user'">
      <h1>Forgot Username</h1>
      <p class="lead fs-3">Enter the email associated with the account below.<br>If you don't remember the email you used, please contact IEEE at <a href="mailto:ieee@purdue.edu">ieee@purdue.edu</a> for more help.</p>
      <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
      <br v-else>
      <div class="row">
        <div class="col-md-6 offset-md-3">
          <form v-on:submit.prevent="forgotUsername">
            <div class="row g-3">
              <div class="col-12 text-start">
                <label for="forgot_user_email" class="form-label">Email Address:</label>
                <input type="text" id="forgot_user_email" class="form-control" placeholder="username@purdue.edu..." v-model="forgot_user_email">
              </div>
              <div class="col-12">
                <button type="submit" class="btn btn-primary mt-3">Find Username</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-else-if="$route.query.type === 'pass'">
      <h1>Forgot Password</h1>
      <p class="lead fs-3">Enter the username of your account below.<br>Instructions will be sent to the email associated with the account.</p>
      <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
      <br v-else>
      <div class="row">
        <div class="col-md-6 offset-md-3">
          <form v-on:submit.prevent="forgotPassword">
            <div class="row g-3">
              <div class="col-12 text-start">
                <label for="forgot_pass_user" class="form-label">Username:</label>
                <input type="text" id="forgot_pass_user" class="form-control" placeholder="mdaniels" v-model="forgot_pass_user">
              </div>
              <div class="col-12">
                <button type="submit" class="btn btn-primary mt-3">Request Password Reset</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-else>
      <h3>Return to the <router-link to="/login">login page</router-link></h3>
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

export default {
  name: 'Forgot',
  data() {
    return {
      dispmsg: '',
      error: false,
      forgot_user_email: '',
      forgot_pass_user: '',
    }
  },
  methods: {
    forgotUsername() {
      this.dispmsg = '';
      this.error = false;
      fetch(`/api/v2/login/forgot-user`, {
        method: 'post',
        credentials: 'include',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({email:this.forgot_user_email}),
      })
      .then((response) => {
        this.error = !response.ok;
        return response.text();
      })
      .then((response) => {
        this.dispmsg = response;
        if (!this.error) this.forgot_user_email = '';
      })
      .catch((error) => {
        console.log(error);
      });
    },
    forgotPassword() {
      this.dispmsg = '';
      this.error = false;
      fetch(`/api/v2/login/forgot-pass`, {
        method: 'post',
        credentials: 'include',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({user:this.forgot_pass_user}),
      })
      .then((response) => {
        this.error = !response.ok;
        return response.text();
      })
      .then((response) => {
        this.dispmsg = response;
        if (!this.error) this.forgot_pass_user = '';
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }
}
</script>
