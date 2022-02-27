<template>
  <div >
    <h3>Approve a Purchase Request</h3>
    <p class="lead">Select a request below to approve.</p>
    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>

    <select id="currentApproval" class="form-select" v-model="currentApprove">
      <option selected disabled value="">Select...</option>
      <option v-for="purchase in approvalList" v-bind:key="purchase.purchaseID" v-bind:value="purchase.purchaseID">{{purchase.item}}</option>
    </select>
    <br><br>
    <div v-if="purchase && purchase.costTooHigh" class="lead fw-bold my-1 fs-4 text-danger">Warning! Purchase cost exceeds committee balance. Please talk to the IEEE Treasurer before approving this purchase</div>
    <div v-if="purchase && purchase.lowBalance" class="lead fw-bold my-1 fs-4 text-warning">Warning! Committe balance is low!</div>
    <form v-on:submit.prevent="approvePurchase('Approved', purchase.purchaseid)" class="row g-3 text-start" v-if="currentApprove !== ''">
      <div class="col-12">
        <label for="purchaserName" class="form-label fw-bold">Requester</label>
        <h3 id="purchaserName">{{purchase.purchasedby}}</h3>
      </div>
      <div class="col-md-6">
        <label for="committeeName" class="form-label fw-bold">Committee</label>
        <h3 id="committeeName">{{purchase.committee}}</h3>
      </div>
      <div class="col-md-6">
        <label for="categoryName" class="form-label fw-bold">Category</label>
        <h3>{{purchase.category}}</h3>
      </div>
      <div class="col-12">
        <label for="itemName" class="form-label fw-bold">Item being Purchased</label>
        <input id="itemName" type="text" class="form-control" placeholder="Resistor, Screws, etc." v-model="purchase.item" required>
      </div>
      <div class="col-12">
        <label for="purchaseReason" class="form-label fw-bold">Reason for Purchase</label>
        <input id="purchaseReason" type="text" class="form-control" placeholder="For testing, building claw, etc." v-model="purchase.purchasereason" required>
      </div>
      <div class="col-12">
        <label for="vendorName" class="form-label fw-bold">Vendor</label>
        <input id="vendorName" type="text" class="form-control" placeholder="Digikey, Amazon, etc." v-model="purchase.vendor" required>
      </div>
      <div class="col-12">
        <label for="costDollars" class="form-label fw-bold">Cost</label>
        <div class="input-group">
          <span class="input-group-text">$</span>
          <input id="costDollars" type="number" step=".01" class="form-control" placeholder="123.45" v-model="purchase.cost" required>
        </div>
      </div>
      <div class="col-12">
        <label for="commentsField" class="form-label fw-bold">Comments (Optional)</label>
        <textarea id="commentsField" type="text" class="form-control" v-model="purchase.comments"></textarea>
      </div>
      <div class="col-12">
        <label for="fundingSelect" class="form-label fw-bold">Funding Source</label>
        <select id="fundingSelect" class="form-select" v-model="funding" required>
          <option selected>BOSO</option>
          <option>Cash</option>
          <option>SOGA</option>
        </select>
      </div>
      <div class="col-md-6 text-center">
        <button type="submit" class="btn btn-success">Approve Request</button>
      </div>
      <div class="col-md-6 text-center">
        <button type="button" class="btn btn-danger" v-on:click="approvePurchase('Denied', purchase.purchaseid)">Deny Request</button>
      </div>
    </form>
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
  name: 'PurchaseApprove',
  data() {
    return {
      error: false,
      dispmsg: '',
      funding: 'BOSO',
      approvalList: [],
      currentApprove: '',
    }
  },
  methods: {
    approvePurchase(status, id) {
      this.dispmsg = '';
      fetch(`/api/v2/purchase/${id}/approve`, {
        method: 'post',
        credentials: 'include',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({committee:this.purchase.committee,item:this.purchase.item,reason:this.purchase.purchasereason,vendor:this.purchase.vendor,price:this.purchase.cost,comments:this.purchase.comments,fundsource:this.funding,status:status}),
      })
      .then((response) => {
        // API key must have expired
        if (response.status === 401) {
          this.$router.replace('/login');
          return response.text()
        }
        this.error = !response.ok;
        if (response.ok) {
          this.approvalList = this.approvalList.filter((p) => {return p.purchaseID !== id});
          this.currentApprove = '';
        }
        return response.text();
      })
      .then((response) => {
        this.dispmsg = response;
      })
    }
  },
  mounted() {
    fetch(`/api/v2/account/${auth_state.state.uname}/approvals`, {
        method: 'get',
        credentials: 'include',
    })
    .then((response) => {
      // API key must have expired
      if (response.status === 401) {
        this.$router.replace('/login');
        return response.text()
      }
      if (!response.ok) {
        this.error = true;
        return response.text();
      }

      return response.json();
    })
    .then((response) => {
      if (this.error) {
        this.dispmsg = response;
        return;
      }

      this.approvalList = response;
    })
    .catch((error) => {
      console.log(error);
    });
  },
  asyncComputed: {
    async purchase() {
      this.dispmsg = '';
      if (this.currentApprove === '') {
        return {
          purchasedby:'',
          committee: '',
          category: '',
          item: '',
          purchasereason: '',
          vendor: '',
          cost: '',
          comments: '',
          costTooHigh: false,
          lowBalance: false,
        };
      }

      // Not sure if this is valid, but it works...
      return await fetch(`/api/v2/purchase/${this.currentApprove}`, {
        method: 'get',
        credentials: 'include',
      })
      .then((response) => {
        // API key must have expired
        if (response.status === 401) {
          this.$router.replace('/login');
          return response.text()
        }
        if (!response.ok) {
          this.error = true;
          return response.text();
        }
        return response.json();
      })
      .then((response) => {
        if (this.error) {
          this.dispmsg = response;
          return {
            purchasedby:'',
            committee: '',
            category: '',
            item: '',
            purchasereason: '',
            vendor: '',
            cost: '',
            comments: '',
            costTooHigh: false,
            lowBalance: false,
          };
        }

        return response;
      })
      .catch((error) => {
        console.log(error);
        return {
          purchasedby:'',
          committee: '',
          category: '',
          item: '',
          purchasereason: '',
          vendor: '',
          cost: '',
          comments: '',
          costTooHigh: false,
          lowBalance: false,
        };
      })
    }
  }
}
</script>
