<template>
  <div class="list-group list-group-flush">
    <router-link to="/access/treasurers" class="list-group-item" exact-active-class="active">Modify Treasurers</router-link>
    <router-link to="/access/officers" class="list-group-item" exact-active-class="active">Modify Officers</router-link>
    <router-link to="/access/internal" class="list-group-item" exact-active-class="active">Modify Internal Leaders</router-link>
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
  name: "AccessNav",
}
</script>
