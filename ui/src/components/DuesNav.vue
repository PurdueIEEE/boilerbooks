<template>
  <div class="list-group list-group-flush">
    <router-link to="/dues/mydues" class="list-group-item" v-bind:class="{active:current.mydues}">View My Dues</router-link>
    <router-link to="/dues/summary" class="list-group-item" v-bind:class="{active:current.summary}" v-if="auth_state.viewOfficer">Committee Dues Summary</router-link>
    <router-link to="/dues/add" class="list-group-item" v-bind:class="{active:current.add}" v-if="auth_state.viewTreasurer">Add New Dues</router-link>
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
  name: 'DuesNav',
  props: {
    current: Object
  },
  data() {
    return {
      auth_state: auth_state.state,
    }
  }
}
</script>
