<template>
  <div class="list-group list-group-flush">
    <router-link to="/purchase/new" class="list-group-item" exact-active-class="active">Request Purchase</router-link>
    <router-link to="/purchase/approve" class="list-group-item" exact-active-class="active" v-if="auth_state.viewApprove">Approve Purchase</router-link>
    <router-link to="/purchase/complete" class="list-group-item" exact-active-class="active">Complete Purchase</router-link>
    <router-link to="/purchase/reimburse" class="list-group-item" exact-active-class="active" v-if="auth_state.viewTreasurer">Reimburse Purchases</router-link>
    <router-link to="/purchase/checks" class="list-group-item" exact-active-class="active">Receive Mailed Checks</router-link>
    <router-link to="/purchase/view" class="list-group-item" exact-active-class="active">View My Purchases</router-link>
    <router-link to="/purchase/reimbursements" class="list-group-item" exact-active-class="active" v-if="auth_state.viewTreasurer">View All Purchases</router-link>
    <router-link to="/" class="list-group-item">Boiler Books Home</router-link>
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

export default {
  name: 'PurchaseNav',
  data() {
    return {
      auth_state: auth_state.state,
    }
  },
}
</script>
