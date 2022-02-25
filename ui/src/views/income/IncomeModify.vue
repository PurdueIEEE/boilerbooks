<template>
  <div>
    <h3>Modify Income</h3>
    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Date</th>
          <th>Source</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Committee</th>
          <th>Item</th>
          <th>Status</th>
          <th>Ref Number</th>
          <th>Modify</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="income in paginatedData" v-bind:key="income.incomeid">
          <td>{{income.date}}</td>
          <td>{{income.source}}</td>
          <td>{{income.type}}</td>
          <td>${{income.amount}}</td>
          <td>{{income.committee}}</td>
          <td>{{income.item}}</td>
          <td>{{income.status}}</td>
          <td>{{income.refnumber}}</td>
          <td>
            <button class="btn btn-outline-info my-1" v-if="income.status !== 'Expected'" v-on:click="updateStatus(income.incomeid, 'Expected')">Expected</button>
            <button class="btn btn-outline-success my-1" v-if="income.status !== 'Received'" v-on:click="updateStatus(income.incomeid, 'Received')">Received</button>
            <button class="btn btn-outline-dark my-1" v-if="income.status !== 'Unreceived'" v-on:click="updateStatus(income.incomeid, 'Unreceived')">Unreceived</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="row">
      <span class="col">Showing {{currPageStart}} - {{currPageEnd}} of {{rows.length}} entries</span>
      <span class="col"><button class="btn btn-secondary" v-bind:disabled="currPage==0" v-on:click="currPageRaw-=1">Prev</button></span>
      <span class="col">Page {{currPage+1}} of {{maxPage+1}}</span>
      <span class="col"><button class="btn btn-secondary" v-bind:disabled="currPage==maxPage" v-on:click="currPageRaw+=1">Next</button></span>
      <span class="col">
        <select class="form-select" v-model="maxElemPerPage">
          <option value="10">10 entries</option>
          <option value="25">25 entries</option>
          <option value="50">50 entries</option>
        </select>
      </span>
    </div>
  </div>
</template>

<script>
import mixin from '@/mixins/DataTables';

export default {
  name: 'IncomeModify',
  mixins: [mixin],
  data() {
    return {
      rows: [],
      error: false,
      dispmsg: '',
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      fetch(`/api/v2/income`, {
        method: 'get',
        credentials: 'include',
      })
      .then((response) => {
        // API key must have expired
        if (response.status === 401) {
          this.$router.replace('/login');
          return response.text()
        }
        this.error = !response.ok;
        if (!response.ok) {
          return response.text();
        }

        return response.json();
      })
      .then((response) => {
        if (this.error) {
          this.dispmsg = response;
          return;
        }

        this.rows = response;
      })
      .catch((error) => {
        console.log(error);
      });
    },
    updateStatus(id, status) {
      let refnumber = "";
      if (status === "Received") {
        refnumber = prompt("Enter the reference number for this income:");
      }

      this.dispmsg = '';
      fetch(`/api/v2/income/${id}`, {
        method: 'put',
        credentials: 'include',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({status:status, refnumber:refnumber}),
      })
      .then((response) => {
        // API key must have expired
        if (response.status === 401) {
          this.$router.replace('/login');
          return response.text();
        }
        this.error = !response.ok
        return response.text();
      })
      .then((response) => {
        this.dispmsg = response;
        if (!this.error) this.init();
      })
      .catch((error) => {
        console.log(error);
      })
    }
  }
}
</script>
