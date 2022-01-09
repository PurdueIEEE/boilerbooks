<template>
  <div class="container-lg my-5 pt-5">

    <div v-if="login_status">
      <h1>Please Sign In</h1>
      <div v-if="error" class="lead fw-bold my-1 fs-3 text-danger">{{errmsg}}</div>
      <form v-on:submit.prevent="login()" name="login_form">
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
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
      <div class="mt-3">
        <button class="btn btn-link"><router-link to="/forgot?type=user" class="link-secondary">Forgot Username</router-link></button>
        <button class="btn btn-link"><router-link to="/forgot?type=pass" class="link-secondary">Forgot Password</router-link></button>
      </div>
      <button class="btn btn-link link-secondary mt-4 fw-bold" v-on:click="swapLoginNew">Make an account</button>
    </div>

    <div v-else>
      <h1>Make a Boiler Books Account</h1>
      <div v-if="error" class="lead fw-bold my-1 fs-3 text-danger">{{errmsg}}</div>
      <div class="row">
        <div class="col-md-6 offset-md-3 text-start p-4">
          <form class="row g-3" v-on:submit.prevent="newAccount()" name="new_form">
            <div class="col-md-6">
              <label for="new_fname" class="form-label">First name</label>
              <input type="text" class="form-control" id="new_fname" v-model="new_fname" placeholder="Mitch" required>
            </div>
            <div class="col-md-6">
              <label for="new_lname" class="form-label">Last Name</label>
              <input type="text" class="form-control" id="new_lname" v-model="new_lname" placeholder="Daniels" required>
            </div>
            <div class="col-md-6">
              <label for="new_email" class="form-label">Email</label>
              <input type="email" class="form-control" id="new_email" v-model="new_email" placeholder="president@purdue.edu" required>
            </div>
            <div class="col-md-6">
              <label for="new_uname" class="form-label">Username</label>
              <input type="text" class="form-control" id="new_uname" v-model="new_uname" placeholder="mdaniels" required>
            </div>
            <div class="col-12">
              <label for="new_address" class="form-label">Address</label>
              <input type="text" class="form-control" id="new_address" v-model="new_address" placeholder="610 Purdue Mall" required>
            </div>
            <div class="col-md-6">
              <label for="new_city" class="form-label">City</label>
              <input type="text" class="form-control" id="new_city" v-model="new_city" placeholder="West Lafayette" required>
            </div>
            <div class="col-md-4">
              <label for="new_state" class="form-label">State</label>
              <input type="text" class="form-control" id="new_state" v-model="new_state" placeholder="IN" required>
            </div>
            <div class="col-md-2">
              <label for="new_zip" class="form-label">Zip</label>
              <input type="text" class="form-control" id="new_zip" v-model="new_zip" placeholder="47907" required>
            </div>
            <div class="col-12">
              <label for="new_pass1" class="form-label">Password</label>
              <input type="password" class="form-control" id="new_pass1" v-model="new_pass1" placeholder="********" required>
            </div>
            <div class="col-12">
              <label for="new_pass2" class="form-label">Retype Password</label>
              <input type="password" class="form-control" id="new_pass2" v-model="new_pass2" placeholder="********" required>
            </div>
            <div class="col-12">
              <label for="new_pin" class="form-label">IEEE Code</label>
              <input type="password" class="form-control" id="new_pin" v-model="new_pin" placeholder="Enter the code given by IEEE to enable account creation" required>
            </div>
            <div class="col-12 mt-4 text-center">
              <button type="submit" class="btn btn-primary">Submit</button>
            </div>
          </form>
        </div>
      </div>
      <button class="btn btn-link link-secondary mt-4 fw-bold" v-on:click="swapLoginNew">I already have an account</button>
    </div>

  </div>
</template>

<script>
import auth_state from '@/state';

export default {
  name: 'Login',
  data() {
    return {
      login_status: true,
      login_uname: '',
      login_pass: '',
      new_fname: '',
      new_lname: '',
      new_email: '',
      new_address: '',
      new_city: '',
      new_state: '',
      new_zip: '',
      new_uname: '',
      new_pass1: '',
      new_pass2: '',
      new_pin: '',
      error: false,
      errmsg: 'sample error',
    }
  },
  mounted() {
    let user = null;
    if (document.cookie.split(';').some((item) => item.trim().startsWith('apikey='))) {
      user = JSON.parse(localStorage.getItem('authState'));
    }
    if (user !== null) {
      auth_state.setAuthState(user);
      this.$router.replace('/');
    }
  },
  methods: {
    login() {
      this.error = false;
      fetch(`http://${location.hostname}/api/login`, {
        method: 'post',
        credentials: 'include',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({uname:this.login_uname, pass:this.login_pass}),
      })
      .then((response) => {
        if (!response.ok) {
          this.error = true;
          return response.text()
        }

        return response.json()
      })
      .then((response) => {
        if (this.error) {
          this.errmsg = response;
        } else {
          auth_state.newAuthState(response);
          this.$router.push('/');
        }
      })
      .catch((error) => {
        console.log(error);
      });
    },
    newAccount() {
      if (this.new_pass1 !== this.new_pass2) {
        this.errmsg = "Passwords do not match"
        this.error = true;
        return;
      }

      if (this.new_pass1.length < 8) {
        this.errmsg = "Password must be at least 8 characters"
        this.error = true;
        return;
      }

      this.error = false;
      fetch(`http://${location.hostname}/api/account`, {
        method: 'post',
        credentials: 'include',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({fname:this.new_fname,lname:this.new_lname,uname:this.new_uname,
                              email:this.new_email,address:this.new_address,city:this.new_city,
                              state:this.new_state,zip:this.new_zip,pass1:this.new_pass1,pass2:this.new_pass2,
                              createpin:this.new_pin}),
      })
      .then((response) => {
        if (!response.ok) {
          this.error = true;
          return response.text()
        }

        return response.json()
      })
      .then((response) => {
        if (this.error) {
          this.errmsg = response;
        } else {
          auth_state.newAuthState(response);
          this.$router.push('/');
        }
      })
      .catch((error) => {
        console.log(error);
      });
    },
    swapLoginNew() {
      this.login_status = !this.login_status;
      this.error = false;
    }
  }
}
</script>
