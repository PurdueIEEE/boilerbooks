<template>
  <div class="container-lg my-5 pt-5">
    <h1>User Details: {{$route.query.id}}</h1>
    <br>
    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>
    <div class="row">
      <!-- This looks misaligned but its actually centered -->
      <div class="col-md-8 offset-md-2">
        <div class="row g-0 text-start">
          <div class="col-md-6 border border-secondary p-3">
          <p class="fs-5">First Name: <span class="fw-bold">{{user.first}}</span></p>
          </div>
          <div class="col-md-6 border border-secondary p-3">
            <p class="fs-5">Last Name: <span class="fw-bold">{{user.last}}</span></p>
          </div>
          <div class="col-md-12 border border-secondary p-3">
            <p class="fs-5">Email: <span class="fw-bold">{{user.email}}</span></p>
          </div>
          <div class="col-md-12 border border-secondary p-3">
            <p class="fs-5">Address <span class="fw-bold">{{user.address}}</span></p>
          </div>
          <div class="col-md-12 border border-secondary p-3">
            <p class="fs-5">City: <span class="fw-bold">{{user.city}}</span></p>
          </div>
          <div class="col-md-6 border border-secondary p-3">
            <p class="fs-5">State: <span class="fw-bold">{{user.state}}</span></p>
          </div>
          <div class="col-md-6 border border-secondary p-3">
            <p class="fs-5">ZIP: <span class="fw-bold">{{user.zip}}</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserView',
  data() {
    return {
      user: {},
      error: false,
      dispmsg: '',
    }
  },
  mounted() {
    fetch(`http://${location.hostname}:3000/account/${this.$route.query.id}`, {
        method: 'get',
        credentials: 'include',
    })
    .then((response) => {
      // API key must have expired
      if (response.status === 401) {
        this.$router.replace('/login');
        return response.text()
      }
      if (!response.ok) {
        this.error = true;
        return response.text();
      }

      return response.json();
    })
    .then((response) => {
      if (this.error) {
        this.dispmsg = response;
        return;
      }

      this.user = response;
    })
    .catch((error) => {
      console.log(error);
    });
  }
}
</script>
