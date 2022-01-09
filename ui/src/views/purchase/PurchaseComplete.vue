<template>
  <div >
    <h3>Complete a purchase</h3>
    <p class="lead">Chose a purchase to complete.</p>
    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>

    <select id="currentApproval" class="form-select" v-model="currentComplete">
      <option selected disabled value="">Select...</option>
      <option v-for="purchase in completionList" v-bind:key="purchase.purchaseID" v-bind:value="purchase.purchaseID">{{purchase.item}}</option>
    </select>
    <br><br>
    <form v-on:submit.prevent="completePurchase(currentComplete)" class="row g-3 text-start" v-if="currentComplete !== ''">
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
        <h3 id="itemName">{{purchase.item}}</h3>
      </div>
      <div class="col-md-6">
        <label for="purchaseReason" class="form-label fw-bold">Reason for Purchase</label>
        <h3 id="purchaseReason">{{purchase.purchasereason}}</h3>
      </div>
      <div class="col-md-6">
        <label for="vendorName" class="form-label fw-bold">Vendor</label>
        <h3 id="vendorName">{{purchase.vendor}}</h3>
      </div>
      <div class="col-12">
        <label for="costDollars" class="form-label fw-bold">Cost</label>
        <div class="input-group">
          <span class="input-group-text">$</span>
          <input id="costDollars" type="number" step=".01" class="form-control" v-model="purchase.cost" required>
        </div>
      </div>
      <div class="col-12">
        <label for="purchaseDate" class="form-label fw-bold">Purchase Date</label>
        <input id="purchaseDate" type="date" class="form-control" v-model="purchasedate" required>
      </div>
      <div class="col-12">
        <label for="receiptFile" class="form-label fw-bold">Receipt File</label>
        <input id="receiptFile" type="file" class="form-control" accept="image/png, image/jpeg, application/pdf" required>
      </div>
      <div class="col-12">
        <label for="commentsField" class="form-label fw-bold">Comments (Optional)</label>
        <textarea id="commentsField" type="text" class="form-control" v-model="purchase.comments"></textarea>
      </div>
      <div class="col-12 text-center">
        <button type="submit" class="btn btn-success">Complete Request</button>
      </div>
    </form>
  </div>
</template>

<script>
import auth_state from '@/state';

const today = new Date();
export default {
  name: 'PurchaseComplete',
  data() {
    return {
      dispmsg: '',
      error: false,
      completionList: [],
      currentComplete: '',
      purchasedate: `${today.getFullYear()}-${(today.getMonth()+1).toString().padStart(2,'0')}-${(today.getDate()).toString().padStart(2,'0')}`,
    }
  },
  methods: {
    completePurchase(id) {
      this.dispmsg = '';

      const formData = new FormData();

      const fileInput = document.querySelector("#receiptFile");

      formData.append('price', this.purchase.cost);
      formData.append('purchasedate', this.purchasedate);
      formData.append('comments', this.purchase.comments);
      formData.append('receipt', fileInput.files[0]);

      fetch(`http://${location.hostname}/api/purchase/${id}/complete`, {
        method: 'post',
        credentials: 'include',
        headers: new Headers({}),
        body: formData,
      })
      .then((response) => {
        // API key must have expired
        if (response.status === 401) {
          this.$router.replace('/login');
          return response.text()
        }
        this.error = !response.ok;
        if (response.ok) {
          this.completionList = this.completionList.filter((p) => {return p.purchaseid !== id});
          this.currentComplete = '';
        }
        return response.text();
      })
      .then((response) => {
        this.dispmsg = response;
      })
    }
  },
  mounted() {
    fetch(`http://${location.hostname}/api/account/${auth_state.state.uname}/completions`, {
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

      this.completionList = response;
    })
    .catch((error) => {
      console.log(error);
    });
  },
  asyncComputed: {
    async purchase() {
      this.dispmsg = '';
      if (this.currentComplete === '') {
        return {
          committee: '',
          category: '',
          item: '',
          purchasereason: '',
          vendor: '',
          cost: '',
          comments: '',
        };
      }

      // Not sure if this is valid, but it works...
      return await fetch(`http://${location.hostname}/api/purchase/${this.currentComplete}`, {
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
            committee: '',
            category: '',
            item: '',
            purchasereason: '',
            vendor: '',
            cost: '',
            comments: '',
          };
        }

        return response;
      })
      .catch((error) => {
        console.log(error);
        return {
          committee: '',
          category: '',
          item: '',
          purchasereason: '',
          vendor: '',
          cost: '',
          comments: '',
        };
      })
    }
  }
}
</script>
