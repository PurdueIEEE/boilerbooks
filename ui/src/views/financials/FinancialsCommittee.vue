<template>
  <div>
    <h3>View Committee Financials</h3>
    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>
    <div class="row g-3 text-start">
      <div class="col-md-6">
        <label for="committeeSelect" class="form-label fw-bold">Committee</label>
        <select id="committeeSelect" class="form-select" v-model="committee" required>
          <option selected disabled value="">Select...</option>
          <option v-for="(val,com) in committeeList" v-bind:key="com" v-bind:value="com">{{val[1]}}</option>
        </select>
      </div>
      <div class="col-md-6">
        <label for="FiscalSelect" class="form-label fw-bold">Fiscal Year</label>
        <select id="FiscalSelect" class="form-select" v-model="fiscalyear" required>
          <option selected disabled value="">Select...</option>
          <option v-for="year in fiscalList" v-bind:key="year">{{year}}</option>
        </select>
      </div>
    </div>
    <br>
    <div v-if="loaded">
      <div class="row my-3 fs-5 fw-bold">
        <div class="col-md-3">Balance: <span v-bind:class="balanceWarnings">${{totalBalance.balance ? totalBalance.balance : '--.--'}}</span></div>
        <div class="col-md-3">Income: ${{totalIncome.income ? totalIncome.income : '---.--'}}</div>
        <div class="col-md-3">Spent: ${{totalSpent.spent ? totalSpent.spent : '---.--'}}</div>
        <div class="col-md-3">Budget: ${{totalBudget.budget ? totalBudget.budget : '---.--'}}</div>
      </div>

      <h4 class="mt-4">{{header}} Financial Summary</h4>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Category</th>
            <th>Spent</th>
            <th>Budget</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in financialSummary" v-bind:key="item.category">
            <td>{{item.category}}</td>
            <td>{{item.spent}}</td>
            <td>{{item.budget}}</td>
          </tr>
        </tbody>
      </table>

      <h4 class="mt-4">{{header}} Expenses</h4>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Purchase ID</th>
            <th>Date</th>
            <th>Item</th>
            <th>Vendor</th>
            <th>Purchaser</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="purchase in expenseTable" v-bind:key="purchase.purchaseid">
            <td><router-link v-bind:to="goToItem(purchase.purchaseid)" class="link-primary text-decoration-none">{{purchase.purchaseid}}</router-link></td>
            <td>{{purchase.date}}</td>
            <td>{{purchase.item}}</td>
            <td>{{purchase.vendor}}</td>
            <td>{{purchase.purchasedby}}</td>
            <td>${{purchase.cost}}</td>
            <td>{{purchase.status}}</td>
          </tr>
        </tbody>
      </table>

      <h4 class="mt-4">{{header}} Income</h4>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>Source</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Item (if donated)</th>
            <th>Status</th>
            <th>Ref Number</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="income in incomeTable" v-bind:key="income.incomeid">
            <td>{{income.date}}</td>
            <td>{{income.source}}</td>
            <td>{{income.type}}</td>
            <td>${{income.amount}}</td>
            <td>{{income.item}}</td>
            <td>{{income.status}}</td>
            <td>{{income.refnumber}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import auth_state from '@/state';

export default {
  name: "FinancialsCommittee",
  data() {
    return {
      committeeList: {},
      fiscalList: [],
      committee: '',
      fiscalyear: '',
      error1: false,
      error2: false,
      dispmsg: ''
    }
  },
  mounted() {
    fetch(`http://${location.hostname}/api/account/${auth_state.state.uname}/committees`, {
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
        this.error1 = true;
        return response.text();
      }

      return response.json();
    })
    .then((response) => {
      if (this.error1) {
        this.dispmsg = response;
        return;
      }
      this.committeeList = response;
    })
    .catch((error) => {
      console.log(error);
    });

    fetch(`http://${location.hostname}/api/budgets/years`, {
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
        this.error2 = true;
        return response.text();
      }

      return response.json();
    })
    .then((response) => {
      if (this.error2) {
        this.dispmsg = response;
        return;
      }
      this.fiscalList = response;
    })
    .catch((error) => {
      console.log(error);
    });
  },
  computed: {
    loaded() {
      return this.committee !== '' && this.fiscalyear !== '';
    },
    header() {
      if (this.committee === '' || this.fiscalyear === '') {
        return '';
      }
      return `${this.fiscalyear} ${this.committeeList[this.committee][1]}`
    },
    balanceWarnings() {
      return {'text-danger':this.totalBalance.balance<100,'text-warning':(this.totalBalance.balance<200&&this.totalBalance.balance>=100)}
    }
  },
  methods: {
    goToItem(id) {
      return `/detail-view?id=${id}`;
    },
  },
  asyncComputed: {
    async totalBalance() {
      if (this.committee === '' || this.fiscalyear === '') {
        return {balance:''};
      }

      return await fetch(`http://${location.hostname}/api/committee/${this.committee}/balance`, {
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
          return {balance:'--.--'};
        }

        return response.json();
      })
      .catch((error) => {
        console.log(error);
        return {balance:'--.--'};
      });
    },
    async totalBudget() {
      if (this.committee === '' || this.fiscalyear === '') {
        return {budget:''};
      }

      return await fetch(`http://${location.hostname}/api/committee/${this.committee}/budget/${this.fiscalyear}`, {
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
          return {budget:'--.--'};
        }

        return response.json();
      })
      .catch((error) => {
        console.log(error);
        return {budget:'--.--'};
      });
    },
    async totalIncome() {
      if (this.committee === '' || this.fiscalyear === '') {
        return {income:''};
      }

      return await fetch(`http://${location.hostname}/api/committee/${this.committee}/incometotal/${this.fiscalyear}`, {
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
          return {income:'--.--'};
        }

        return response.json();
      })
      .catch((error) => {
        console.log(error);
        return {income:'--.--'};
      });
    },
    async totalSpent() {
      if (this.committee === '' || this.fiscalyear === '') {
        return {spent:''};
      }

      return await fetch(`http://${location.hostname}/api/committee/${this.committee}/expensetotal/${this.fiscalyear}`, {
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
          return {spent:'--.--'};
        }

        return response.json();
      })
      .catch((error) => {
        console.log(error);
        return {spent:'--.--'};
      });
    },
    async financialSummary() {
      if (this.committee === '' || this.fiscalyear === '') {
        return {};
      }

      return await fetch(`http://${location.hostname}/api/committee/${this.committee}/summary/${this.fiscalyear}`, {
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
          return {};
        }

        return response.json();
      })
      .catch((error) => {
        console.log(error);
        return {};
      });
    },
    async expenseTable() {
      if (this.committee === '' || this.fiscalyear === '') {
        return [];
      }

      return await fetch(`http://${location.hostname}/api/committee/${this.committee}/purchases/${this.fiscalyear}`, {
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
          return [];
        }

        return response.json();
      })
      .catch((error) => {
        console.log(error);
        return [];
      });
    },
    async incomeTable() {
      if (this.committee === '' || this.fiscalyear === '') {
        return [];
      }

      return await fetch(`http://${location.hostname}/api/committee/${this.committee}/income/${this.fiscalyear}`, {
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
          return [];
        }

        return response.json();
      })
      .catch((error) => {
        console.log(error);
        return [];
      });
    }
  }
}
</script>
