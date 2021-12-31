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
      //TODO actually add the authentication here
      const getAuth = {
        id:'1',
        fname:'Purdue',
        lname:'Pete',
        uname:'ppete',
        email:'test@example.com',
        p_approvePerm: true,
      };
      auth_state.setAuthState(getAuth);
      this.$router.push('/');
    }
  }
}
</script>
