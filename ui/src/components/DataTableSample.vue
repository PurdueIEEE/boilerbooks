<template>
  <div class="text-center">
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="data in paginatedData" v-bind:key="data.key">
          <td></td>
        </tr>
      </tbody>
    </table>
    <div class="row">
      <span class="col">Showing {{currPageStart}} - {{currPageEnd}} of {{rows.length}} entries</span>
      <span class="col"><button class="btn btn-secondary" v-bind:disabled="currPage==0" v-on:click="currPageRaw-=1">Prev</button></span>
      <span class="col">Page {{currPage+1}} of {{maxPage+1}}</span>
      <span class="col"><button class="btn btn-secondary" v-bind:disabled="currPage==maxPage" v-on:click="currPageRaw+=1">Next</button></span>
      <span class="col">
        <select class="form-select" v-model="maxElemPerPage">
          <option value="10">10 entries</option>
          <option value="25">25 entries</option>
          <option value="50">50 entries</option>
        </select>
      </span>
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


/*
  SAMPLE DATA TABLE, DO NOT USE
  this is a template for what the mixin expects
*/
import mixin from '@/mixins/DataTables';

export default {
  name: "DataTable",
  mixins: [mixin],
  data() {
    return {
      rows: [],
    }
  }
}
</script>
