<template>
  <div class="container-lg my-5 pt-5">
    <h1>Please Sign In</h1>
    <form onsubmit="return false;" class="container-lg">
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
      <button type="submit" class="btn btn-primary" v-on:click="login">Submit</button>
    </form>
    <div class="mt-3">
      <button class="btn btn-link">Forgot Username</button> <button class="btn btn-link">Forgot Password</button>
    </div>
    <button class="btn btn-link mt-4 fw-bold">Make an Account</button>
  </div>
</template>

<script>
import auth_state from '@/state';

export default {
  name: 'Login',
  data() {
    return {
      login_uname: '',
      login_pass: '',
    }
  },
  methods: {
    login() {
      fetch('http://localhost:3000/account/login', {
        method: 'post',
        headers: new Headers({'x-api-key': auth_state.state.apikey,'content-type': 'application/json'}),
        body: JSON.stringify({uname:this.login_uname, pass:this.login_pass}),
      })
      .then((response) => {
        if (!response.ok) {
          console.log(response.status);
          // find some way to actually return a failed promise
        }

        return response.json()
      })
      .then((response) => {
        auth_state.setAuthState({uname:response.uname, apikey:response.apikey, p_approvePerm:true});
        this.$router.push('/');
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }
}
</script>
