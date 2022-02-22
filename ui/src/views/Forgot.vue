<template>
  <div class="container-lg my-5 pt-5">
    <div v-if="$route.query.type === 'user'">
      <h1>Forgot Username</h1>
      <p class="lead fs-3">Enter the email associated with the account below. If you don't remember the email you used, please contact an IEEE Officer at <a href="mailto:ieee@purdue.edu">ieee@purdue.edu</a> for more help.</p>
      <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>
      <div class="row">
        <div class="col-md-6 offset-md-3 text-start">
          <form v-on:submit.prevent="forgotUsername">
            <label for="forgot_user_email" class="form-label">Email Address:</label>
            <input type="text" id="forgot_user_email" class="form-control" placeholder="username@purdue.edu..." v-model="forgot_user_email">
            <button type="submit" class="btn btn-primary mt-3">Find Username</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// TODO add a forgot check

export default {
  name: 'Forgot',
  data() {
    return {
      dispmsg: '',
      error: false,
      forgot_user_email: ''
    }
  },
  methods: {
    forgotUsername() {
      this.dispmsg = '';
      this.error = false;
      fetch(`http://${location.hostname}/api/login/forgot-user`, {
        method: 'post',
        credentials: 'include',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({email:this.forgot_user_email}),
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
      })
    },
    forgotPassword() {

    }
  }
}
</script>
