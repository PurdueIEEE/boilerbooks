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
        <tr v-for="income in incomeTable" v-bind:key="income.incomeid">
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
  </div>
</template>

<script>
export default {
  name: 'IncomeModify',
  data() {
    return {
      incomeTable: [],
      error: false,
      dispmsg: '',
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      fetch(`http://${location.hostname}/api/income`, {
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
          return this.dispmsg = response;
        }

        this.incomeTable = response;
      })
      .catch((error) => {
        console.log(error);
        return {income:'--.--'};
      });
    },
    updateStatus(id, status) {
      let refnumber = "";
      if (status === "Received") {
        refnumber = prompt("Enter the reference number for this income:");
      }

      this.dispmsg = '';
      fetch(`http://${location.hostname}/api/income/${id}`, {
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
