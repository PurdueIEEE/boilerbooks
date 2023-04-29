<template>
  <div>
    <h3>Advanced Committee Purchase Search</h3>
    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>
    <form v-on:submit.prevent="submitSearch">
      <div class="row g-2 text-start">
        <div class="col-md-5">
          <label for="searchCommittee" class="form-label fw-bold">Committee</label>
          <select id="searchCommittee" class="form-select" v-model="committee" required>
            <option selected value="any">ALL COMMITTEES</option>
            <option v-for="(val,com) in committeeList" v-bind:key="com" v-bind:value="com">{{val}}</option>
          </select>
        </div>

        <div class="col-md-5">
          <label for="searchFiscalYear" class="form-label fw-bold">Fiscal Year</label>
          <select id="searchFiscalYear" class="form-select" v-model="fiscalyear" required>
            <option selected value="any">ALL FISCAL YEARS</option>
            <option v-for="val in fiscalList" v-bind:key="val" v-bind:value="val">{{val}}</option>
          </select>
        </div>

        <div class="col-md-2">
          <label for="searchJoiner" class="form-label fw-bold">Join Fields With</label>
          <select id="searchJoiner" class="form-select" v-model="joiner" required>
            <option selected>OR</option>
            <option>AND</option>
          </select>
        </div>

        <div class="col-md-12">
          <div class="row">
            <label for="searchItem" class="form-label fw-bold">Item Name</label>
            <div class="col-sm-3">
              <select id="searchItemModifier" class="form-select" v-model="itemModifier">
                <option selected>LIKE</option>
                <option>EXACTLY</option>
                <option>NOT LIKE</option>
              </select>
            </div>
            <div class="col-sm-9">
              <input id="searchItem" type="text" class="form-control" v-model="itemKey" placeholder="Phrase to search - leave blank for any"/>
            </div>
          </div>
        </div>

        <div class="col-md-12">
          <div class="row">
            <label for="searchVendor" class="form-label fw-bold">Vendor</label>
            <div class="col-sm-3">
              <select id="searchVendorModifier" class="form-select" v-model="vendorModifier">
                <option selected>LIKE</option>
                <option>EXACTLY</option>
                <option>NOT LIKE</option>
              </select>
            </div>
            <div class="col-sm-9">
              <input id="searchItem" type="text" class="form-control" v-model="vendorKey" placeholder="Phrase to search - leave blank for any"/>
            </div>
          </div>
        </div>

        <div class="col-md-12">
          <div class="row">
            <label for="searchVendor" class="form-label fw-bold">Purchase Reason</label>
            <div class="col-sm-3">
              <select id="searchVendorModifier" class="form-select" v-model="reasonModifier">
                <option selected>LIKE</option>
                <option>EXACTLY</option>
                <option>NOT LIKE</option>
              </select>
            </div>
            <div class="col-sm-9">
              <input id="searchItem" type="text" class="form-control" v-model="reasonKey" placeholder="Phrase to search - leave blank for any"/>
            </div>
          </div>
        </div>

        <div class="col-md-12 text-center mt-4">
          <button type="submit" class="btn btn-success">Submit Search</button>
        </div>
      </div>
    </form>

    <hr/>

    <h3>Search results</h3>
    <p class="fs-5">Open purchases in a new tab to preserve your search</p>
    <DataTable
      v-bind:rows="searchResults"
      v-bind:row_key="'purchaseID'"
      v-bind:row_headers="[
        ['Purchase ID', 'purchaseID'],
        ['Purchase Date', 'date'],
        ['Item', 'item'],
        ['Committee', 'committee'],
        ['Purchased By', 'purchasedby'],
        ['Status', 'status']]"
    >
      <template v-slot:data="purchase">
        <td><router-link v-bind:to="goToItem(purchase.row.purchaseID)" class="link-primary text-decoration-none">{{purchase.row.purchaseID}}</router-link></td>
        <td>{{purchase.row.date}}</td>
        <td>{{purchase.row.item}}</td>
        <td>{{purchase.row.committee}}</td>
        <td>{{purchase.row.purchasedby}}</td>
        <td>{{purchase.row.status}}</td>
      </template>
    </DataTable>

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

import DataTable from '@/components/DataTable.vue';
import { fetchWrapperJSON } from '@/api_wrapper';
import auth_state from '@/state';

export default {
  name: "FinancialsSearch",
  components: {
    DataTable,
},
  data() {
    return {
      committeeList: {},
      fiscalList: [],
      committee: 'any',
      fiscalyear: 'any',
      joiner: 'OR',
      itemKey: '',
      itemModifier: 'LIKE',
      vendorKey: '',
      vendorModifier: 'LIKE',
      reasonKey: '',
      reasonModifier: 'LIKE',
      searchResults: [],
      error: false,
      dispmsg: '',
    }
  },
  async mounted() {
    const committeeList = await fetchWrapperJSON(`/api/v2/account/${auth_state.state.uname}/committees?readonly=yes`, {
      method: 'get',
    });

    const fiscalList = await fetchWrapperJSON(`/api/v2/budgets/years`, {
      method: 'get',
    });

    if (committeeList.error) {
      this.error = true;
      this.dispmsg = committeeList.response;
      return;
    }

    if (fiscalList.error) {
      this.error = true;
      this.dispmsg = fiscalList.response;
      return;
    }

    this.committeeList = committeeList.response;
    this.fiscalList = fiscalList.response;
  },
  methods: {
    async submitSearch() {
      this.dispmsg = "";
      const response = await fetchWrapperJSON('/api/v2/search', {
        method: 'post',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({
          committee: this.committee,
          fiscalyear: this.fiscalyear,
          joiner: this.joiner,
          itemKey: this.itemKey,
          itemModifier: this.itemModifier,
          vendorKey: this.vendorKey,
          vendorModifier: this.vendorModifier,
          reasonKey: this.reasonKey,
          reasonModifier: this.reasonModifier,
        }),
      });

      if (response.error) {
        this.error = true;
        this.dispmsg = response.response;
        return;
      }

      this.searchResults = response.response;
    },
    goToItem(id) {
      return `/detail-view?id=${id}`;
    },
  },
}
</script>
