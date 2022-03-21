<template>
  <div>
    <h3>Add Dues Paying Member</h3>
    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>
    <form v-on:submit.prevent="submitDues()" class="row g-3 text-start">
      <div class="col-12">
        <label for="memberName" class="form-label fw-bold">Member Name</label>
        <input id="memberName" type="text" class="form-control" placeholder="Purdue Pete" v-model="memberName" required>
      </div>
      <div class="col-6">
        <label for="memberEmail" class="form-label fw-bold">Email</label>
        <input id="memberEmail" type="email" class="form-control" placeholder="pete@purdue.edu" v-model="memberEmail" required>
      </div>
      <div class="col-6">
        <label for="memberID" class="form-label fw-bold">Purdue ID (optional)</label>
        <input id="memberID" type="text" class="form-control" placeholder="0012345678" v-model="memberID">
      </div>
      <div class="col-12">
        <label for="committeeCheck" class="form-label fw-bold">Committee(s)</label>
        <fieldset id="committeeCheck" class="d-flex flex-wrap justify-content-center">
          <div class="form-check p-3 m-2 border" v-for="comm in committeeList" v-bind:key="comm">
            <input class="form-check-input" type="checkbox" v-bind:value="comm" v-bind:id="comm" v-model="memberCommittees">
            <label class="form-check-label" v-bind:for="comm">{{comm}}</label>
          </div>
        </fieldset>
      </div>
      <div class="col-12 text-center">
        <button type="submit" class="btn btn-success">Submit New Member</button>
      </div>
    </form>
  </div>
</template>

<script>
/*
  Copyright 2022 Purdue IEEE and Hadi Ahmed

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

export default {
  name: "DuesAdd",
  data() {
    return {
      error: false,
      dispmsg: '',
      memberName: '',
      memberEmail: '',
      memberID: '',
      memberCommittees: [],
      committeeList: [],
    }
  },
  mounted() {
    fetch(`/api/v2/dues/committees`, {
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
    submitDues() {
      this.dispmsg = "";
      if (this.memberID.length > 0 && !(/^00[0-9]{8}$/.test(this.memberID))) {
        this.error = true;
        this.dispmsg = "Purdue ID must be 10 digits padded by 0s";
        return;
      }

      if (this.memberCommittees.length === 0) {
        this.error = true;
        this.dispmsg = "Member must be in at least one committee";
        return;
      }

      fetch('/api/v2/dues', {
        method: "post",
        credentials: "include",
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({name:this.memberName,email:this.memberEmail,puid:this.memberID,committees:this.memberCommittees})
      })
      .then((response) => {
        // API key must have expired
        if (response.status === 401) {
          this.$router.replace('/login');
          return response.text()
        }
        this.error = !response.ok;
        return response.text();
      })
      .then((response) => {
        this.dispmsg = response;
        if (!this.error) {
          this.memberName = '';
          this.memberEmail = '';
          this.memberID = '';
        }
      })
      .catch((error) => {
        console.log(error);
      })
    }
  }
}
</script>