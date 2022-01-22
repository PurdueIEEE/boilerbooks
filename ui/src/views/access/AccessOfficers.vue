<template>
  <div>
    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>

    <h3>Current Officers</h3>
    <table class="table table-hover table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Username</th>
          <th>Position</th>
          <th>Committee</th>
          <th>Remove?</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in officerList" v-bind:key="user.username">
          <td>{{user.name}}</td>
          <td>{{user.username}}</td>
          <td>{{user.role}}</td>
          <td>{{user.committee}}</td>
          <td><button class="btn btn-danger" v-on:click="remove(user.username)">Remove</button></td>
        </tr>
      </tbody>
    </table>
    <br><br>
    <h3>Add New Officer</h3>
    <form v-on:submit.prevent="create()" class="row g-3 text-start">
      <div class="col-md-12">
        <label for="nameInput" class="form-label fw-bold">Username</label>
        <input id="nameInput" type="text" class="form-control" placeholder="Enter their Boiler Books username..." v-model="username" required>
      </div>
      <div class="col-md-6">
        <label for="committeeSelect" class="form-label fw-bold">Committee</label>
        <select id="committeeSelect" class="form-select" v-model="committee" required>
          <option selected disabled value="">Select...</option>
          <option v-for="(val,com) in committeeList" v-bind:key="com" v-bind:value="com">{{val[1]}}</option>
        </select>
      </div>
      <div class="col-md-6">
        <label for="roleInput" class="form-label fw-bold">Role</label>
        <input id="roleInput" type="text" class="form-control" placeholder="Committee Chair" v-model="role" required>
      </div>
      <div class="col-md-12 text-center">
        <button type="submit" class="btn btn-success">Add Officer</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'AccessOfficers',
  data() {
    return {
      error: false,
      dispmsg: '',
      officerList: [],
      committeeList: [],
      username: '',
      role: '',
      committee: '',
    }
  },
  mounted() {
    this.init();
    fetch(`http://${location.hostname}/api/committee`, {
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
      this.committeeList = response;
    })
    .catch((error) => {
      console.log(error);
    });
  },
  methods: {
    init() {
      fetch(`http://${location.hostname}/api/access/officers`, {
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
        this.officerList = response;
      })
      .catch((error) => {
        console.log(error);
      });
    },
    remove(username) {
      fetch(`http://${location.hostname}/api/access/approvals/${username}`, {
        method: 'delete',
        credentials: 'include',
      })
      .then((response) => {
        // API key must have expired
        if (response.status === 401) {
          this.$router.replace('/login');
          return response.text();
        }
        this.error = !response.ok;
        return response.text();
      })
      .then((response) => {
        this.dispmsg = response;
        if (!this.error) this.init();
      })
      .catch((error) => {
        console.log(error);
      });
    },
    create() {
      fetch(`http://${location.hostname}/api/access/officers`, {
        method: 'post',
        credentials: 'include',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({username:this.username,role:this.role,committee:this.committeeList[this.committee][0]}),
      })
      .then((response) => {
        // API key must have expired
        if (response.status === 401) {
          this.$router.replace('/login');
          return response.text();
        }
        this.error = !response.ok;
        return response.text();
      })
      .then((response) => {
        this.dispmsg = response;
        if (!this.error) this.init();
        this.username = '';
        this.role = '';
        this.committee = '';
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }
}
</script>
