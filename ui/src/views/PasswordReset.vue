<template>
  <div class="container-lg my-5 pt-5">
    <h1>Reset Your Password</h1>
    <p class="lead fs-3">Enter a new password below.</p>
    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>
      <div class="row">
      <div class="col-md-6 offset-md-3">
        <form v-on:submit.prevent="resetPassword">
          <div class="row g-3">
            <div class="col-12 text-start">
              <label for="reset_pass1" class="form-label">New Password:</label>
              <input type="password" id="reset_pass1" class="form-control" placeholder="********" v-model="pass1">
            </div>
            <div class="col-12 text-start">
              <label for="reset_pass2" class="form-label">Reenter Password:</label>
              <input type="password" id="reset_pass2" class="form-control" placeholder="********" v-model="pass2">
            </div>
            <div class="col-12">
              <button type="submit" class="btn btn-primary mt-3">Reset Password</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PasswordReset",
  data() {
    return {
      pass1: '',
      pass2: '',
      dispmsg: '',
      error: false,
    }
  },
  methods: {
    resetPassword() {
      if (this.pass1 !== this.pass2) {
        this.dispmsg = "Passwords do not match";
        this.error = true;
        return;
      }

      if (this.pass1.length < 8) {
        this.dispmsg = "Password must be at least 8 characters";
        this.error = true;
        return;
      }

      this.dispmsg = "";
      fetch(`http://${location.hostname}/api/login/reset`, {
        method: 'post',
        credentials: 'include',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({pass1:this.pass1, pass2:this.pass2, uname: this.$route.query.user, rstlink:this.$route.query.rstlink}),
      })
      .then((response) => {
        this.error = !response.ok;
        return response.text();
      })
      .then((response) => {
        this.dispmsg = response;
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }
}
</script>
