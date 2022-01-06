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
import auth_state from '@/state';

export default {
  name: 'Account',
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
    updateAccount() {
      fetch(`http://${location.hostname}:3000/account/${auth_state.state.uname}`, {
        method: 'put',
        credentials: 'include',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({uname:auth_state.state.uname,fname:this.fname,lname:this.lname,email:this.email,address:this.address,city:this.city,state:this.state,zip:this.zip}),
      })
      .then((response) => {
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
    },
    changePassword() {
      this.$router.push('/myaccount/password');
    }
  },
  mounted() {
    fetch(`http://${location.hostname}:3000/account/${auth_state.state.uname}`, {
        method: 'get',
        credentials: 'include',
        headers: new Headers({'content-type': 'application/json'}),
      })
      .then((response) => {
        // API key must have expired
        if (response.status === 401) {
          this.$router.replace('/login');
          return response.text()
        }
        this.error = !response.ok;
        if (!response.ok) {
          return response.text()
        }

        return response.json()
      })
      .then((response) => {
        if (this.error) {
          this.dispmsg = response;
        }

        this.fname = response.first;
        this.lname = response.last;
        this.email = response.email;
        this.address = response.address;
        this.city = response.city;
        this.state = response.state;
        this.zip = response.zip;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
</script>
