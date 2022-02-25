<template>
  <div>
    <h3>Approve Committee Budgets</h3>
    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>
    <div class="my-3 row justify-content-center">
      <div v-for="(items, comm) in submittedBudgets" v-bind:key="comm" class="p-3 m-2 bg-light border rounded-3 row text-start col-md-10">
        <p class="fs-2 fw-bold">{{committeeList[comm][1]}}</p>
        <ul>
          <li v-for="item in items" v-bind:key="comm+item.category" class="fs-2 ms-5">{{item.category}} - <span class="fw-bold">${{item.amount}}</span></li>
        </ul>
        <button class="btn btn-success" v-on:click="approveBudget(comm)">Approve</button>
      </div>
      <p v-if="Object.keys(submittedBudgets).length === 0" class="fs-3 lead">All budgets approved.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BudgetApprove',
  data() {
    return {
      dispmsg: '',
      error: false,
      submittedBudgets: {},
      committeeList: {},
    }
  },
  mounted() {
    fetch(`/api/v2/committee`, {
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

    this.init();
  },
  methods: {
    approveBudget(comm) {
      fetch(`/api/v2/budgets/${comm}`, {
        method: 'put',
        credentials: 'include',
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
          this.init();
        }
      })
      .catch((error) => {
        console.log(error);
      });
    },
    init() {
      fetch(`/api/v2/budgets/submitted`, {
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

        let filtered_response = {}
        for (let committee in response) {
          if (response[committee].length !== 0) {
            filtered_response[committee] = response[committee];
          }
        }
        this.submittedBudgets = filtered_response;
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }
}
</script>
