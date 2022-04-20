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
          <th v-for="header in row_headers" v-bind:key="header[0]">
            <i class="bi bi-caret-down-fill sort-arrow" v-bind:class="{'sort-arrow-selected': sortKey===header[1]&&!sortKeyAsc}" v-on:click="sortDesc(header[1])" v-if="header[1]!==''"></i>
            {{header[0]}}
            <i class="bi bi-caret-up-fill sort-arrow" v-bind:class="{'sort-arrow-selected': sortKey===header[1]&&sortKeyAsc}" v-on:click="sortAsc(header[1])" v-if="header[1]!==''"></i>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in paginatedData" v-bind:key="row[row_key]">
          <slot name="data" v-bind:row="row"></slot>
        </tr>
      </tbody>
    </table>
    <div class="row">
      <span class="col">Showing {{currPageStart}} - {{currPageEnd}} of {{searchData.length}} entries<span v-if="searchKey !== ''"><br>Filtered from {{rows.length}} entries</span></span>
      <span class="col"><button class="btn btn-secondary" v-bind:disabled="currPage==0" v-on:click="currPage-=1">Prev</button></span>
      <span class="col">Page {{currPage+1}} of {{maxPage+1}}</span>
      <span class="col"><button class="btn btn-secondary" v-bind:disabled="currPage==maxPage" v-on:click="currPage+=1">Next</button></span>
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
      currPage: 0,
      maxElemPerPage: 10,
      searchKey: '',
      useRegex: [],
      sortKey: '',
      sortKeyAsc: false,
    }
  },
  props: {
    rows: {
      type: Array,
      required: true,
    },
    row_key: {
      type: String,
      required: true,
    },
    row_headers: {
      type: Array,
      required: true,
    }
  },
  watch: {
    maxPage(newVal) {
      // prevent the currPage from exceeding the actual max page
      if (this.currPage > newVal) {
        this.currPage = this.maxPage;
      }
    }
  },
  computed: {
    searchData() {
      let rowsToKeep = [];
      try {
        const searchRE = new RegExp(`.*${this.useRegex.length ? this.searchKey : this.escapeRegEx(this.searchKey.toLowerCase())}.*`);
        for (let row of this.rows) {
          for (let key in row) {
            if (searchRE.test(this.useRegex.length ?
                              row[key] ? row[key] : '' :
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
    sortData() {
      if (this.sortKey === '') return this.searchData;
      // Allows us to deep copy the array, could be converted to a watch property later
      let sortData = JSON.parse(JSON.stringify(this.searchData));
      sortData.sort((a, b) => {
        if ((a[this.sortKey] ? a[this.sortKey].toString().toLowerCase() : '')
          < (b[this.sortKey] ? b[this.sortKey].toString().toLowerCase() : '')) {
          return this.sortKeyAsc ? -1 : 1;
        }
        if ((a[this.sortKey] ? a[this.sortKey].toString().toLowerCase() : '')
          > (b[this.sortKey] ? b[this.sortKey].toString().toLowerCase() : '')) {
          return this.sortKeyAsc ? 1 : -1;
        }
        return 0;
      });
      return sortData;
    },
    paginatedData() {
      if (this.sortData.length < this.maxElemPerPage) {
        return this.sortData;
      }
      return this.sortData.slice((this.currPage) * this.maxElemPerPage, (this.currPage + 1) * this.maxElemPerPage);
    },
    maxPage() {
      if (this.sortData.length == 0) return 0;
      return Math.floor((this.sortData.length - 1) / this.maxElemPerPage);
    },
    currPageEnd() {
      if (this.currPage == this.maxPage) {
        return this.sortData.length
      }
      return (this.currPage+1)*this.maxElemPerPage
    },
    currPageStart() {
      if (this.sortData.length == 0) return 0;
      return (this.currPage*this.maxElemPerPage) + 1;
    }
  },
  methods: {
    escapeRegEx(str) {
      return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
    },
    sortAsc(key) {
      if (this.sortKey === key) {
        this.sortKey = '';
        return;
      }
      this.sortKey = key;
      this.sortKeyAsc = true;
    },
    sortDesc(key) {
      if (this.sortKey === key) {
        this.sortKey = '';
        return;
      }
      this.sortKey = key;
      this.sortKeyAsc = false;
    }
  }
}
</script>

<style scoped>
  .sort-arrow {
    color:black;
  }
  .sort-arrow:hover {
    color: #00629B;
  }
  .sort-arrow-selected {
    color: #CFB991;
  }
</style>
