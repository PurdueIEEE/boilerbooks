<template>
  <div class="container-lg my-5 pt-5">
    <h1>Boiler Books v2</h1>
    <h3>Financial Recordkeeping Software</h3>

    <!-- Begin the DIV SOUP -->
    <div class="row mt-5 justify-content-center">

        <div class="col-3 d-flex align-items-stretch mb-3">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Purchasing</h5>
            <p class="card-text ">Purchase tracking for committees. Request, approve, and complete purchases.</p>
          </div>
          <div class="card-footer">
            <router-link to="/purchase" class="btn btn-secondary">Go to Purchasing</router-link>
          </div>
        </div>
        </div>

        <div class="col-3 d-flex align-items-stretch mb-3" v-if="auth_state.viewFinancials">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Income and Donations</h5>
            <p class="card-text">Income tracking for committees. Create expected income and track income status.</p>
          </div>
          <div class="card-footer">
            <router-link to="/income" class="btn btn-secondary">Go to Income</router-link>
          </div>
        </div>
        </div>

        <div class="col-3 d-flex align-items-stretch mb-3" v-if="auth_state.viewFinancials">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">View Financials</h5>
            <p class="card-text">View income and expenses for each committee per fiscal year.</p>
          </div>
          <div class="card-footer">
            <router-link to="/financials" class="btn btn-secondary">Go to Financials</router-link>
          </div>
        </div>
        </div>

        <div class="col-3 d-flex align-items-stretch mb-3">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Club Dues</h5>
            <p class="card-text">View your club dues and committee rosters. Add new members and dues payments.</p>
          </div>
          <div class="card-footer">
            <router-link to="/" class="btn btn-secondary disabled">Go to Dues</router-link>
          </div>
        </div>
        </div>

        <div class="col-3 d-flex align-items-stretch mb-3" v-if="auth_state.viewOfficer">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Committee Budgets</h5>
            <p class="card-text">Modify committee budget categories for current fiscal year.</p>
          </div>
          <div class="card-footer">
            <router-link to="/" class="btn btn-secondary disabled">Go to Budgets</router-link>
          </div>
        </div>
        </div>

        <div class="col-3 d-flex align-items-stretch mb-3" v-if="auth_state.viewTreasurer">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Adjust Access Roles</h5>
            <p class="card-text">Add and remove access roles to user accounts. Grant and revoke approval permissions.</p>
          </div>
          <div class="card-footer">
            <router-link to="/" class="btn btn-secondary disabled">Go to Roles</router-link>
          </div>
        </div>
        </div>

    </div>

  </div>
</template>

<script>
import auth_state from '@/state';

export default {
  name: 'Home',
  data() {
    return {
      auth_state: auth_state.state,
    }
  }
}
</script>
