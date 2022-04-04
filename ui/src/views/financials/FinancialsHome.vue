<template>
  <div>
    <h3>Current Committee Balances</h3>
    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Balance</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(bal, comm) in totalBalances" v-bind:key="comm">
          <td>{{comm}}</td>
          <td>${{bal ? parseFloat(bal).toLocaleString('en-US',{minimumFractionDigits:2}) : "0.00"}}</td>
        </tr>
      </tbody>
    </table>
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
  name: "FinancialsHome",
  data() {
    return {
      totalBalances: {},
      error: false,
      dispmsg: '',
    }
  },
  mounted() {
    fetch(`/api/v2/account/${auth_state.state.uname}/balances`, {
        method: 'get',
        credentials: 'include',
    })
    .then((response) => {
      // API key must have expired
      if (response.status === 401) {
        auth_state.clearAuthState();
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

      this.totalBalances = response;
    })
    .catch((error) => {
      console.log(error);
    });
  }
}
</script>
