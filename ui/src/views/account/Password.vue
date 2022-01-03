<template>
  <div class="container-lg my-5 pt-5">
    <h1>Change Password</h1>

    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <div v-if="passerr" class="lead fw-bold my-1 fs-3 text-danger">Passwords do not match!</div>
    <br v-else>

    <!--<div class="row my-2">
      <div class="text-end col-md-4">
        <h4>Current Password</h4>
      </div>
      <div class="col-md-8">
        <input class="form-control" type="password" placeholder="********" v-model="current">
      </div>
    </div>-->

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
import auth_state from '@/state';

export default {
  name: 'Account',
  data() {
    return {
      current: '',
      new_pass: '',
      new_pass_again: '',
      dispmsg: '',
      error: false,
    }
  },
  computed: {
    passerr() {
      if(this.new_pass === '' || this.new_pass_again === '') return;
      return this.new_pass !== this.new_pass_again;
    }
  },
  methods: {
    changePassword() {
      if (this.new_pass !== this.new_pass_again) {
        return;
      }

      fetch(`http://${location.hostname}:3000/account/${auth_state.state.uname}`, {
        method: 'post',
        headers: new Headers({'x-api-key': auth_state.state.apikey,'content-type': 'application/json'}),
        body: JSON.stringify({uname:auth_state.state.uname,pass1:this.new_pass,pass2:this.new_pass_again}),
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
    }
  },
}
</script>
