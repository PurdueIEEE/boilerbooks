<template>
  <div >
    <h3>Request a New Purchase</h3>
    <p class="lead">Fill out the details below to create a new purchase request.</p>
    <div v-if="dispmsg!==''" class="lead fw-bold my-1 fs-3" v-bind:class="{'text-success':!error,'text-danger':error}">{{dispmsg}}</div>
    <br v-else>
    <form onsubmit="return false;" class="row g-3 text-start">
      <div class="col-md-6">
        <label for="committeeSelect" class="form-label fw-bold">Committee</label>
        <select id="committeeSelect" class="form-select" v-model="committee" required>
          <option selected disabled value="">Select...</option>
          <option v-for="(val,com) in committeeList" v-bind:key="com" v-bind:value="com">{{val[1]}}</option>
        </select>
      </div>
      <div class="col-md-6">
        <label for="categorySelect" class="form-label fw-bold">Category</label>
        <select id="categorySelect" class="form-select" v-model="category" required>
          <option selected disabled value="">Select...</option>
          <option v-for="cat in categoryList" v-bind:key="cat.category">{{cat.category}}</option>
        </select>
      </div>
      <div class="col-12">
        <label for="itemName" class="form-label fw-bold">Item to Purchase</label>
        <input id="itemName" type="text" class="form-control" placeholder="Resistor, Screws, etc." v-model="itemName" required>
      </div>
      <div class="col-12">
        <label for="purchaseReason" class="form-label fw-bold">Reason for Purchase</label>
        <input id="purchaseReason" type="text" class="form-control" placeholder="For testing, building claw, etc." v-model="itemReason" required>
      </div>
      <div class="col-12">
        <label for="vendorName" class="form-label fw-bold">Vendor</label>
        <input id="vendorName" type="text" class="form-control" placeholder="Digikey, Amazon, etc." v-model="vendor" required>
      </div>
      <div class="col-12">
        <label for="costDollars" class="form-label fw-bold">Cost</label>
        <div class="input-group">
          <span class="input-group-text">$</span>
          <input id="costDollars" type="number" step=".01" class="form-control" placeholder="123.45" v-model="price" required>
        </div>
      </div>
      <div class="col-12">
        <label for="commentsField" class="form-label fw-bold">Comments (Optional)</label>
        <textarea id="commentsField" type="text" class="form-control" v-model="comments"></textarea>
      </div>
      <div class="col-md-6 offset-md-3 text-center">
        <button type="submit" class="btn btn-success" v-on:click="submitRequest">Submit Request</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'PurchaseNew',
  data() {
    return {
      committeeList: [],
      committee: '',
      category: '',
      itemName: '',
      itemReason: '',
      vendor: '',
      price: '',
      comments: '',
      error: false,
      dispmsg: '',
    }
  },
  methods: {
    submitRequest() {
      this.dispmsg = '';
      fetch(`http://${location.hostname}:3000/purchase/new`, {
        method: 'post',
        credentials: 'include',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({committee:this.committeeList[this.committee][0],category:this.category,item:this.itemName,reason:this.itemReason,vendor:this.vendor,price:this.price,comments:this.comments}),
      })
      .then((response) => {
        // API key must have expired
        if (response.status === 401) {
          this.$router.replace('/login');
          return response.text()
        }
        this.error = !response.ok;
        return response.text();
      })
      .then((response) => {
        this.dispmsg = response;
      })
    }
  },
  mounted() {
    fetch(`http://${location.hostname}:3000/committee`, {
      method: 'get',
      credentials: 'include',
      headers: new Headers({'content-type': 'application/json'}),
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
      this.committeeList = response;
    })
    .catch((error) => {
      console.log(error);
    })
  },
  asyncComputed: {
    async categoryList() {
      this.category = '';
      if (this.committee === '') return [];

      // Not sure if this is valid, Promises confuse me sometimes
      return await fetch(`http://${location.hostname}:3000/committee/${this.committee}/categories`, {
        method: 'get',
        credentials: 'include',
        headers: new Headers({'content-type': 'application/json'}),
      })
      .then((response) => {
        // API key must have expired
        if (response.status === 401) {
          this.$router.replace('/login');
          return response.text()
        }
        if (!response.ok) {
          return [];
        }

        return response.json();
      })
      .catch((error) => {
        console.log(error);
        return [];
      })
    }
  }
}
</script>
