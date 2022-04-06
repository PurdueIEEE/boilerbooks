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
        <div class="col-md-3">Balance: <span v-bind:class="balanceWarnings">${{totalBalance.balance ? parseFloat(totalBalance.balance).toLocaleString('en-US',{minimumFractionDigits:2}) : '0.00'}}</span></div>
        <div class="col-md-3">Income: ${{totalIncome.income ? parseFloat(totalIncome.income).toLocaleString('en-US',{minimumFractionDigits:2}) : '0.00'}}</div>
        <div class="col-md-3">Spent: ${{totalSpent.spent ? parseFloat(totalSpent.spent).toLocaleString('en-US',{minimumFractionDigits:2}) : '0.00'}}</div>
        <div class="col-md-3">Budget: ${{totalBudget.budget ? parseFloat(totalBudget.budget).toLocaleString('en-US',{minimumFractionDigits:2}) : '0.00'}}</div>
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
            <td>
              {{item.category}}
              <span v-if="item.budget !== 'Approved'" class="text-danger">*</span>
              </td>
            <td>{{item.spent}}</td>
            <td>{{item.amount}}</td>
          </tr>
        </tbody>
      </table>
      <small><span class="text-danger">*</span> = Budget item not approved</small>

      <h4 class="mt-4">{{header}} Expenses</h4>
      <DataTable v-bind:rows="expenseTable">
        <template v-slot:header>
          <th>Purchase ID</th>
          <th>Date</th>
          <th>Item</th>
          <th>Category</th>
          <th>Vendor</th>
          <th>Purchaser</th>
          <th>Amount</th>
          <th>Status</th>
        </template>
        <template v-slot:data="filteredData">
          <tr v-for="purchase in filteredData.data" v-bind:key="purchase.purchaseid">
            <td><router-link v-bind:to="goToItem(purchase.purchaseid)" class="link-primary text-decoration-none">{{purchase.purchaseid}}</router-link></td>
            <td>{{purchase.date}}</td>
            <td>{{purchase.item}}</td>
            <td>{{purchase.category}}</td>
            <td>{{purchase.vendor}}</td>
            <td>{{purchase.purchasedby}}</td>
            <td>${{purchase.cost}}</td>
            <td>{{purchase.status}}</td>
          </tr>
        </template>
      </DataTable>

      <h4 class="mt-4">{{header}} Income</h4>
      <DataTable v-bind:rows="incomeTable">
        <template v-slot:header>
          <th>Date</th>
          <th>Source</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Item (if donated)</th>
          <th>Status</th>
          <th>Ref Number</th>
        </template>
       <template v-slot:data="filteredData">
          <tr v-for="income in filteredData.data" v-bind:key="income.incomeid">
            <td>{{income.date}}</td>
            <td>{{income.source}}</td>
            <td>{{income.type}}</td>
            <td>${{income.amount}}</td>
            <td>{{income.item}}</td>
            <td>{{income.status}}</td>
            <td>{{income.refnumber}}</td>
          </tr>
       </template>
      </DataTable>
    </div>
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

import auth_state from '@/state';
import DataTable from '@/components/DataTable.vue';
import { fetchWrapperJSON } from '@/api_wrapper';


export default {
  name: "FinancialsCommittee",
  components: {
    DataTable,
  },
  data() {
    return {
      committeeList: {},
      fiscalList: [],
      committee: '',
      fiscalyear: '',
      found_comm: false,
      found_fy: false,
      error1: false,
      error2: false,
      dispmsg: ''
    }
  },
  async mounted() {
    const committeeList = await fetchWrapperJSON(`/api/v2/account/${auth_state.state.uname}/committees`, {
      method: 'get',
      credentials: 'include',
    });

    const fiscalList = await fetchWrapperJSON(`/api/v2/budgets/years`, {
      method: 'get',
      credentials: 'include',
    });

    if (committeeList.error) {
      this.error1 = true;
      this.dispmsg = committeeList.response;
      return;
    }

    if (fiscalList.error) {
      this.error2 = true;
      this.dispmsg = fiscalList.response;
      return;
    }

    this.committeeList = committeeList.response;
    this.fiscalList = fiscalList.response

    if (this.$route.query.comm) {
      this.found_comm = true;
      this.committee = this.$route.query.comm;
    }
    if (this.$route.query.fy) {
      this.found_fy = true;
      this.fiscalyear = this.$route.query.fy;
    }
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
      if (this.totalBalance === null || this.totalBalance === undefined) return {};
      return {'text-danger':this.totalBalance.balance<100,'text-warning':(this.totalBalance.balance<200&&this.totalBalance.balance>=100)}
    }
  },
  methods: {
    goToItem(id) {
      return `/detail-view?id=${id}`;
    },
  },
  watch: {
    committee: function(newVal) {
      if (this.found_comm) {
        this.found_comm = false;
        return;
      }
      this.$router.push({path: '/financials/committee', query: {comm: newVal, fy: this.fiscalyear}});
    },
    fiscalyear: function(newVal) {
      if (this.found_fy) {
        this.found_fy = false;
        return;
      }
      this.$router.push({path: '/financials/committee', query: {comm: this.committee, fy: newVal}});
    }
  },
  asyncComputed: {
    totalBalance: {
      async get() {
        if (this.committee === '' || this.fiscalyear === '') {
          return {balance:''};
        }

        const response = await fetchWrapperJSON(`/api/v2/committee/${this.committee}/balance`, {
          method: 'get',
          credentials: 'include',
        });

        if (response.error) {
          return {balance:'--.--'};
        }

        return response.response;
      },
      default: {balance:''},
    },
    totalBudget: {
      async get() {
        if (this.committee === '' || this.fiscalyear === '') {
          return {budget:''};
        }

        const response = await fetchWrapperJSON(`/api/v2/committee/${this.committee}/budget/${this.fiscalyear}`, {
          method: 'get',
          credentials: 'include',
        });

        if (response.error) {
          return {budget:'--.--'};
        }

        return response.response;
      },
      default: {budget:''},
    },
    totalIncome: {
      async get() {
        if (this.committee === '' || this.fiscalyear === '') {
          return {budget:''};
        }

        const response = await fetchWrapperJSON(`/api/v2/committee/${this.committee}/incometotal/${this.fiscalyear}`, {
          method: 'get',
          credentials: 'include',
        });

        if (response.error) {
          return {budget:'--.--'};
        }

        return response.response;
      },
      default: {income:''},
    },
    totalSpent: {
      async get() {
        if (this.committee === '' || this.fiscalyear === '') {
          return {budget:''};
        }

        const response = await fetchWrapperJSON(`/api/v2/committee/${this.committee}/expensetotal/${this.fiscalyear}`, {
          method: 'get',
          credentials: 'include',
        });

        if (response.error) {
          return {budget:'--.--'};
        }

        return response.response;
      },
      default: {spent:''},
    },
    financialSummary: {
      async get() {
        if (this.committee === '' || this.fiscalyear === '') {
          return [];
        }

        const response = await fetchWrapperJSON(`/api/v2/committee/${this.committee}/summary/${this.fiscalyear}`, {
          method: 'get',
          credentials: 'include',
        });

        if (response.error) {
          return [];
        }

        return response.response;
      },
      default: [],
    },
    expenseTable: {
      async get() {
        if (this.committee === '' || this.fiscalyear === '') {
          return [];
        }

        const response = await fetchWrapperJSON(`/api/v2/committee/${this.committee}/purchases/${this.fiscalyear}`, {
          method: 'get',
          credentials: 'include',
        });

        if (response.error) {
          return [];
        }

        return response.response;
      },
      default: [],
    },
    incomeTable: {
      async get() {
        if (this.committee === '' || this.fiscalyear === '') {
          return [];
        }

        const response = await fetchWrapperJSON(`/api/v2/committee/${this.committee}/income/${this.fiscalyear}`, {
          method: 'get',
          credentials: 'include',
        });

        if (response.error) {
          return [];
        }

        return response.response;
      },
      default: [],
    },
  }
}
</script>
