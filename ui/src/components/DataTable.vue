<template>
  <div class="text-center">
    <div class="row align-items-center">
      <div class="col-4 offset-3 text-end fw-bold">
        Search:
      </div>
      <div class="col-3">
        <input class="form-control" v-model="searchKey">
      </div>
      <div class="col-2 text-start">
        <input class="form-check-input me-2" type="checkbox" value="RegExp" v-model="useRegex">
        <label class="form-check-label">Use RegEx?</label>
      </div>
    </div>
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <slot name="header"></slot>
        </tr>
      </thead>
      <tbody>
        <slot name="data" v-bind:data="paginatedData"></slot>
      </tbody>
    </table>
    <div class="row">
      <span class="col">Showing {{currPageStart}} - {{currPageEnd}} of {{searchData.length}} entries<span v-if="searchKey !== ''"><br>Filtered from {{rows.length}} entries</span></span>
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
export default {
  name: "DataTable",
  data() {
    return {
      currPageRaw: 0,
      maxElemPerPage: 10,
      searchKey: '',
      useRegex: [],
    }
  },
  props: {
    rows: {
      type: Array,
      required: true,
    },
  },
  computed: {
    currPage() {
      if (this.currPageRaw > this.maxPage) {
        return this.maxPage
      }
      return this.currPageRaw;
    },
    searchData() {
      let rowsToKeep = [];
      try {
        const searchRE = new RegExp(`.*${this.useRegex.length ? this.searchKey : this.escapeRegEx(this.searchKey.toLowerCase())}.*`);
        for (let row of this.rows) {
          for (let key in row) {
            if (searchRE.test(this.useRegex.length ? row[key] :
                              row[key] ? row[key].toString().toLowerCase() : '')) {
              rowsToKeep.push(row);
              break;
            }
          }
        }
      } catch (e) {
        console.log(e)
        return this.rows;
      }
      return rowsToKeep;
    },
    paginatedData() {
      if (this.searchData.length < this.maxElemPerPage) {
        return this.searchData;
      }
      return this.searchData.slice((this.currPage) * this.maxElemPerPage, (this.currPage + 1) * this.maxElemPerPage);
    },
    maxPage() {
      if (this.searchData.length == 0) return 0;
      return Math.floor((this.searchData.length - 1) / this.maxElemPerPage);
    },
    currPageEnd() {
      if (this.currPage == this.maxPage) {
        return this.searchData.length
      }
      return (this.currPage+1)*this.maxElemPerPage
    },
    currPageStart() {
      if (this.searchData.length == 0) return 0;
      return (this.currPage*this.maxElemPerPage) + 1;
    }
  },
  methods: {
    escapeRegEx(str) {
      return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
    }
  }
}
</script>
