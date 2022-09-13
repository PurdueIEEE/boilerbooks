<template>
  <div class="container-lg my-5 pt-5">
    <div class="text-center">
      <p class="lead fs-3">Loading Boiler Books...</p>
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
import auth_state from '@/state';

export default {
  name: 'OIDCLogin',
  async mounted() {
    const response = await fetchWrapperJSON('/api/v2/oidc/userinfo', {
      method: 'get',
    });

    if (response.error) {
      console.log(response.response);
      return;
    }

    auth_state.setAuthState(response.response);
    this.$router.replace("/");
  }
}
</script>
