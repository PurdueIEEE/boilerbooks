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
        <div class="col-md-3">Balance: <span v-bind:class="{'text-danger':totalBalance<100,'text-warning':(totalBalance<200&&totalBalance>=100)}">${{totalBalance.balance}}</span></div>
        <div class="col-md-3">Income: ${{totalIncome.income}}</div>
        <div class="col-md-3">Spent: ${{totalSpent.spent}}</div>
        <div class="col-md-3">Budget: ${{totalBudget.budget}}</div>
      </div>
      <h4>{{header}} Financial Summary</h4>
      <h4>{{header}} Expenses</h4>
      <h4>{{header}} Income</h4>
    </div>
  </div>
</template>

<script>
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
    }
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
    }
  }
}
</script>
