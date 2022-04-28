<template>
  <div class="container-lg my-5 pt-5">
    <h1>Committee Budgets</h1>
    <div class="row mt-5">
      <div class="col-md-3">
        <BudgetNav></BudgetNav>
      </div>
      <div class="col-md-9">
        <router-view></router-view>
      </div>
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

import BudgetNav from '@/components/BudgetNav.vue';

export default {
  name: 'BudgetFrame',
  components: {
    BudgetNav,
  }
}
</script>
