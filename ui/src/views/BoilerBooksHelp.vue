<template>
  <div class="container-lg my-5 pt-5">
    <h1 class="mb-3">Boiler Books Help</h1>
    <div class="text-start">
      <div id="info">
        <p class="lead fs-3">Boiler Books is an expense and income tracking system.</p>
        <p class="fs-5">
        It was developed on behalf of IEEE to track all purchases for the organization.
        The system allows any IEEE member to create an account and request to purchase
        something on behalf of the indicated committee.
        </p>
        <p class="fs-5">
        In addition to being a convenient system to request and approve purchases, members
        also have the ability to view all of their past purchases. Those with the appropriate
        permissions are also able to view purchases and income for their entire committee.
        </p>
        <p class="fs-5">
        Boiler Books is open source, licensed under the Apache 2.0 license, and under active
        development. If there is a feature you would like to see, send us an email at
        <a href="mailto:ieee-officers@purdueieee.org">ieee-officers@purdueieee.org</a>.
        If you would like to help development, <a href="https://github.com/purdueieee/boilerbooks" target="_blank">visit our GitHub</a>!
        </p>
      </div>
      <hr/>
      <div id="purchase">
        <p class="lead fs-3">Purchasing Process</p>
        <ol class="fs-5">
          <li>Any user makes a purchase request, filling out details about the item and some tracking information</li>
          <li>The committee chair or a designated committee member will review the request and approve or deny it</li>
          <li>After successfully purchasing the approved item, the purchaser will complete the request and upload a receipt</li>
          <li>The treasurer will submit the purchase for reimbursement from the Purdue Business Office for Student Organizations</li>
        </ol>
      </div>
      <div id="income" v-if="showIncome">
        <hr>
        <p class="lead fs-3">Income Process</p>
        <p class="fs-5">
          Report Income and Donations using the 'Income' tab. Income is money given
          to your committee. Donations are items or discounts that are non-monetary.
        </p>
        <p class="fs-5">
          A quick rule-of-thumb: If you can spend it, it is Income and counts towards your balance.
          If you can use it, it is a donation and does not count towards your balance.
        </p>
        <p class="fs-5">
          Mark income as 'Expected' if it is being sent by an organization. Mark income as 'Credit' if it will be paid later, like as part of a grant.
          The Treasurer will modify the status to track the income across it's lifecycle.
        </p>
        <p class="fs-5">
          Direct any questions towards the IEEE Treasurer.
        </p>
      </div>
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

import auth_state from '@/state';

export default {
  name: 'BoilerBooksHelp',
  data() {
    return {
      auth_state: auth_state.state,
    }
  },
  computed: {
    showIncome() {
      return this.auth_state.uname !== '' && this.auth_state.viewFinancials;
    }
  }
}
</script>
