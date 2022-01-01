<template>
  <div class="container-lg my-5 pt-5">
    <h1>Boiler Books Account Details</h1>
    <br>

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
    }
  },
  methods: {
    updateAccount() {
      // TODO implement a account update call
    },
    changePassword() {
      this.$router.push('/myaccount/password');
    }
  },
  mounted() {
    fetch('http://localhost:3000/account', {
        method: 'get',
        headers: new Headers({'x-api-key': auth_state.state.apikey,'content-type': 'application/json'}),
      })
      .then((response) => {
        if (!response.ok) {
          console.log(response.status);
          // find some way to actually return a failed promise
        }

        return response.json()
      })
      .then((response) => {
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
