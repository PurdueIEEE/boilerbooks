<template>
    <div>
    <h3>Check Dues Income</h3>
    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>
    <p>Any numbers on this page <em>may be</em> incorrect. Verify all dues income with actual deposits.</p>
    <div class="text-center">
      <div class="row g-3 text-start">
        <div class="col-md-12">
          <label for="FiscalSelect" class="form-label fw-bold">Fiscal Year</label>
          <select id="FiscalSelect" class="form-select" v-model="fiscalyear" required>
            <option selected disabled value="">Select...</option>
            <option v-for="year in fiscalList" v-bind:key="year">{{year}}</option>
          </select>
        </div>
      </div>
      <br/>
      <div class="row g-3">
        <div class="col-md-6">
          <p class="fs-5"><b>Expected Dues Income:</b></p>
        </div>
        <div class="col-md-6">
          <p class="fs-5">${{parseFloat(expectedIncome.total).toLocaleString('en-US',{minimumFractionDigits:2})}}</p>
        </div>
        <div class="col-md-6">
          <p class="fs-5"><b>Actual Dues Income:</b></p>
        </div>
        <div class="col-md-6">
          <p class="fs-5">${{parseFloat(actualIncomeTotal).toLocaleString('en-US',{minimumFractionDigits:2})}}</p>
        </div>
      </div>
      <br/>
      <h4>Actual Dues Deposits</h4>
      <DataTable
        v-bind:rows="actualIncome"
        v-bind:row_key="'incomeid'"
        v-bind:row_headers="[
        ['Income ID','incomeid'],
        ['Added By','addedbyname'],
        ['Source','source'],
        ['Amount','amount'],
        ['Ref Number','refnumber'],
        ['Status', 'status']]"
      >
        <template v-slot:data="dues">
          <td>{{dues.row.incomeid}}</td>
          <td>{{dues.row.addedbyname}}</td>
          <td>{{dues.row.source}}</td>
          <td>${{dues.row.amount}}</td>
          <td>{{dues.row.refnumber}}</td>
          <td>{{dues.row.status}}</td>
        </template>
      </DataTable>
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

import { fetchWrapperJSON } from '@/api_wrapper';
import DataTable from '@/components/DataTable.vue';

export default {
  name: "DuesIncome",
  components: {
    DataTable
  },
  data() {
    return {
      actualIncome: [],
      expectedIncome: {total:0},
      fiscalList: [],
      fiscalyear: '',
      error: false,
      dispmsg: "",
    };
  },
  async mounted() {
    const fiscalList = await fetchWrapperJSON(`/api/v2/budgets/years`, {
      method: 'get',
      credentials: 'include',
    });

    if (fiscalList.error) {
      this.error2 = true;
      this.dispmsg = fiscalList.response;
      return;
    }

    this.fiscalList = fiscalList.response;
  },
  computed: {
    actualIncomeTotal() {
      let sum = 0;
      for(let income of this.actualIncome) {
        sum += income.amount;
      }
      return sum;
    }
  },
  watch: {
    async fiscalyear(newVal) {
      this.dispmsg = '';

      const actualIncome = await fetchWrapperJSON(`/api/v2/dues/income/${newVal}`,{
        method: 'get',
        credentials: 'include'
      });

      const expectedIncome = await fetchWrapperJSON(`/api/v2/dues/expected/${newVal}`,{
        method: 'get',
        credentials: 'include'
      });

      if (actualIncome.error) {
        this.error = true;
        this.dispmsg = actualIncome.response;
        return;
      }

      if (expectedIncome.error) {
        this.error = true;
        this.dispmsg = expectedIncome.response;
        return;
      }

      this.actualIncome = actualIncome.response;
      this.expectedIncome = expectedIncome.response;
    }
  }
}
</script>
