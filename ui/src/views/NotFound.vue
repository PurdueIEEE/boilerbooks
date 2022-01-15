<template>
  <div class="container-lg my-5 pt-5">
    <br>
    <h1>404 Page Not Found</h1>
    <br>
    <p class="lead fs-3">Uh oh - the page you are looking for does not exist.</p>
    <p class="fs-3">Please check the URL or return to <router-link to="/" class="link-primary">the home page</router-link>.</p>
  </div>
</template>

<script>
export default {
  name: "NotFound",
}
</script>
