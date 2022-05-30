<template>
    <div>
    <h3>Modify Dues Entries</h3>
    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>

    <div class="modal" id="editDuesModal" tabindex="-1" aria-labelledby="editDuesModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <form v-on:submit.prevent="updateDues()" class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editDuesModalLabel">Edit Information for Dues Entry {{editId}}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row g-3 text-start">
              <div class="col-md-12">
                  <label for="editDuesName" class="form-label fw-bold">Name</label>
                  <input id="editDuesName" type="text" class="form-control" placeholder="Purdue Pete" v-model="editName" required/>
              </div>
              <div class="col-md-12">
                  <label for="editDuesEmail" class="form-label fw-bold">Name</label>
                  <input id="editDuesEmail" type="email" class="form-control" placeholder="pete@purdue.edu" v-model="editEmail" required/>
              </div>
              <div class="col-md-12">
                <label for="committeeCheck" class="form-label fw-bold">Committee(s)</label>
                <fieldset id="committeeCheck" class="d-flex flex-wrap justify-content-center">
                  <div class="form-check p-3 m-2 border" v-for="comm in committeeList" v-bind:key="comm">
                    <input class="form-check-input" type="checkbox" v-bind:value="comm" v-bind:id="comm" v-model="editCommittee" v-bind:disabled="disableCommittee">
                    <label class="form-check-label" v-bind:for="comm">{{comm}}</label>
                  </div>
                  <div class="form-check p-3 m-2 border">
                    <input class="form-check-input" type="checkbox" value="None" v-model="editCommittee" v-bind:disabled="disableNone">
                    <label class="form-check-label"><b>None</b></label>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="submit" class="btn btn-primary">Update Dues Entry</button>
          </div>
        </form>
      </div>
    </div>

    <div class="text-center">
      <DataTable
        v-bind:rows="rows"
        v-bind:row_key="'duesid'"
        v-bind:row_headers="[
        ['Name','name'],
        ['Email','email'],
        ['Year','fiscal_year'],
        ['Status','status'],
        ['Update',''],
        ['Edit','']]"
      >
        <template v-slot:data="dues">
          <td>{{dues.row.name}}</td>
          <td>{{dues.row.email}}</td>
          <td>{{dues.row.fiscal_year}}</td>
          <td>{{dues.row.status}}</td>
          <td>
            <button class="btn btn-outline-info my-1" v-on:click="updateStatus(dues.row.duesid, 'Paid')">Paid</button>
            <br>
            <button class="btn btn-outline-dark my-1" v-on:click="updateStatus(dues.row.duesid, 'Exempt')">Exempt</button>
          </td>
          <td><button class="btn btn-outline-primary" v-on:click="triggerUpdateModal(dues.row)">Edit</button></td>
        </template>
      </DataTable>
      <br/><br/>
      <h5>NOTE: 'Exempt' members are those who have an existing International IEEE membership.</h5>
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

import { fetchWrapperJSON, fetchWrapperTXT } from '@/api_wrapper';
import DataTable from '@/components/DataTable.vue';
import { Modal } from 'bootstrap';

export default {
  name: "DuesStatus",
  components: {
    DataTable
  },
  data() {
    return {
      rows: [],
      error: false,
      dispmsg: "",
      editId: '',
      editName: '',
      editEmail: '',
      editCommittee: [],
      duesModal: null,
      committeeList: [],
    };
  },
  async mounted() {
    this.init();
    const response = await fetchWrapperJSON(`/api/v2/dues/committees`, {
      method: 'get',
      credentials: 'include',
    });

    if (response.error) {
      this.error = true;
      this.dispmsg = response.response;
      return;
    }

    this.committeeList = response.response;
  },
  methods: {
    async init() {
      const response = await fetchWrapperJSON('/api/v2/dues/all',{
        method: 'get',
        credentials: 'include'
      });

      if (response.error) {
        this.error = true;
        this.dispmsg = response.response;
        return;
      }

      this.rows = response.response;
      this.duesModal = new Modal(document.getElementById('editDuesModal'), {backdrop:'static', 'keyboard':false});
    },
    async updateStatus(id, status) {
      this.dispmsg = '';
      const response = await fetchWrapperTXT(`/api/v2/dues/${id}`,{
        method: 'put',
        credentials: 'include',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({status:status}),
      });

      this.error = response.error;
      this.dispmsg = response.response;

      if (!response.error) {
        this.init();
      }
    },
    triggerUpdateModal(dues) {
      this.editId = dues.duesid;
      this.editName = dues.name;
      this.editEmail = dues.email;

      this.editCommittee = dues.committee.split(',');

      // this is a holdover since some multi-committee dues use ', ' instead of ','
      //  FIXME: this should probabaly be standardized
      for(let i=0; i < this.editCommittee.length; i++) {
        this.editCommittee[i] = this.editCommittee[i].trim();
      }

      this.duesModal.show();
    },
    async updateDues() {
      if (this.editCommittee.length === 0) {
        return;
      }

      if (this.editCommittee.includes('None') && this.editCommittee.length > 1) {
        return;
      }

      this.duesModal.hide();

      const response = await fetchWrapperTXT(`/api/v2/dues/${this.editId}`, {
        method: 'put',
        credentials: 'include',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({name:this.editName,email:this.editEmail,committees:this.editCommittee})
      });

      this.error = response.error;
      this.dispmsg = response.response;

      if (!response.error) {
        this.init();
      }
    }
  },
  computed: {
    disableNone() {
      return this.editCommittee.length !== 0 && !this.editCommittee.includes("None");
    },
    disableCommittee() {
      return this.editCommittee.includes("None");
    }
  },
}
</script>
