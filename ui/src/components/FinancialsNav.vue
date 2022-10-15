<template>
  <div class="list-group list-group-flush">
    <router-link to="/financials" class="list-group-item" exact-active-class="active">Current Balances</router-link>
    <router-link to="/financials/committee" class="list-group-item" exact-active-class="active">Committee Breakdown</router-link>
    <router-link to="/financials/export" class="list-group-item" exact-active-class="active">Export Committee Data</router-link>
    <router-link to="/financials/search" class="list-group-item" exact-active-class="active">Advanced Purchase Search</router-link>
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

export default {
  name: 'FinancialsNav',
}
</script>
