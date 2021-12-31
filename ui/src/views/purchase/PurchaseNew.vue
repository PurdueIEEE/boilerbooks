<template>
  <div >
    <h3>Request a New Purchase</h3>
    <p class="lead">Fill out the details below to create a new purchase request.</p>

    <form onsubmit="return false;" class="row g-3 text-start">
      <div class="col-md-6">
        <label for="committeeSelect" class="form-label fw-bold">Committee</label>
        <select id="committeeSelect" class="form-select" v-model="committee" required>
          <option selected disable value="">Select...</option>
          <option>General IEEE</option>
          <option>Aerial Robotics</option>
        </select>
      </div>
      <div class="col-md-6">
        <label for="categorySelect" class="form-label fw-bold">Category</label>
        <select id="categorySelect" class="form-select" v-model="category" required>
          <option selected disabled value="">Select...</option>
          <option>General Expense</option>
          <option>TODO</option>
        </select>
      </div>
      <div class="col-12">
        <label for="itemName" class="form-label fw-bold">Item to Purchase</label>
        <input id="itemname" type="text" class="form-control" placeholder="Resistor, Screws, etc." v-model="itemName" required>
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
        <label for="commentsField" class="form-label fw-bold">Comments</label>
        <textarea id="commentsField" type="text" class="form-control" v-model="comments"></textarea>
      </div>
      <button type="submit" class="btn btn-success" v-on:click="submitRequest">Submit Request</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'PurchaseNew',
  data() {
    return {
      committee: '',
      category: '',
      itemName: '',
      itemReason: '',
      vendor: '',
      price: '',
      comments: '',
    }
  },
  methods: {
    submitRequest() {
      // TODO submit the request here
    }
  }
}
</script>
