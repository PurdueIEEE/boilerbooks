<template>
  <div class="container-lg my-5 pt-5">
    <h1>Change Password</h1>
    <br>

    <div class="row my-2">
      <div class="text-end col-md-4">
        <h4>Current Password</h4>
      </div>
      <div class="col-md-8">
        <input class="form-control" type="password" placeholder="********" v-model="current">
      </div>
    </div>

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
export default {
  name: 'Account',
  data() {
    return {
      current: '',
      new_pass: '',
      new_pass_again: '',
    }
  },
  methods: {
    changePassword() {
      // TODO implement a password change API call
    }
  },
}
</script>
