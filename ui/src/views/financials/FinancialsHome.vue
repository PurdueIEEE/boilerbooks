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
          <td>${{bal}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
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
