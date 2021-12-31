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

    <button class="btn btn-primary mt-2 mx-1" v-on:click="updateAccount">Update Account</button>
    <button class="btn btn-secondary mt-2 mx-1" v-on:click="changePassword">Change Password</button>
  </div>
</template>

<script>
import auth_state from '@/state';

export default {
  name: 'Account',
  data() {
    return {
      fname: auth_state.state.fname,
      lname: auth_state.state.lname,
      email: auth_state.state.email,
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
}
</script>
