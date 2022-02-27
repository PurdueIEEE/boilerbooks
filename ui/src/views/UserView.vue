<template>
  <div class="container-lg my-5 pt-5">
    <h1>User Details: {{$route.query.id}}</h1>
    <br>
    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>
    <div class="row">
      <!-- This looks misaligned but its actually centered -->
      <div class="col-md-8 offset-md-2">
        <div class="row g-0 text-start">
          <div class="col-md-6 border border-secondary p-3">
          <p class="fs-5">First Name: <span class="fw-bold">{{user.first}}</span></p>
          </div>
          <div class="col-md-6 border border-secondary p-3">
            <p class="fs-5">Last Name: <span class="fw-bold">{{user.last}}</span></p>
          </div>
          <div class="col-md-12 border border-secondary p-3">
            <p class="fs-5">Email: <span class="fw-bold">{{user.email}}</span></p>
          </div>
          <div class="col-md-12 border border-secondary p-3">
            <p class="fs-5">Address: <span class="fw-bold">{{user.address}}</span></p>
          </div>
          <div class="col-md-12 border border-secondary p-3">
            <p class="fs-5">City: <span class="fw-bold">{{user.city}}</span></p>
          </div>
          <div class="col-md-6 border border-secondary p-3">
            <p class="fs-5">State: <span class="fw-bold">{{user.state}}</span></p>
          </div>
          <div class="col-md-6 border border-secondary p-3">
            <p class="fs-5">ZIP: <span class="fw-bold">{{user.zip}}</span></p>
          </div>
        </div>
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

export default {
  name: 'UserView',
  data() {
    return {
      user: {},
      error: false,
      dispmsg: '',
    }
  },
  mounted() {
    if (this.$route.query.id === undefined || this.$route.query.id === '') {
      return;
    }
    fetch(`/api/v2/account/${this.$route.query.id}`, {
        method: 'get',
        credentials: 'include',
    })
    .then((response) => {
      // API key must have expired
      if (response.status === 401) {
        this.$router.replace('/login');
        return response.text()
      }
      if (!response.ok) {
        this.error = true;
        return response.text();
      }

      return response.json();
    })
    .then((response) => {
      if (this.error) {
        this.dispmsg = response;
        return;
      }

      this.user = response;
    })
    .catch((error) => {
      console.log(error);
    });
  }
}
</script>
