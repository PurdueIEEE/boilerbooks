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

import { reactive } from 'vue';

let auth_state = {
    state: reactive({
        uname: "",
        viewFinancials: false,
        viewApprove: false,
        viewOfficer: false,
        viewTreasurer: false,
    }),
    newAuthState(newAuth) {
        localStorage.setItem('authState', JSON.stringify(newAuth));
        this.state.uname = newAuth.uname;
        this.state.viewFinancials = newAuth.viewFinancials;
        this.state.viewApprove = newAuth.viewApprove;
        this.state.viewOfficer = newAuth.viewOfficer;
        this.state.viewTreasurer = newAuth.viewTreasurer;
    },
    setAuthState(newAuth) {
        this.state.uname = newAuth.uname;
        this.state.viewFinancials = newAuth.viewFinancials;
        this.state.viewApprove = newAuth.viewApprove;
        this.state.viewOfficer = newAuth.viewOfficer;
        this.state.viewTreasurer = newAuth.viewTreasurer;
    },
    clearAuthState() {
        localStorage.removeItem('authState');
        document.cookie="apikey=logout; max-age=-1; SameSite=Strict; path=/";
        this.state.uname = '';
        this.state.viewFinancials = false;
        this.state.viewApprove = false;
        this.state.viewOfficer = false;
        this.state.viewTreasurer = false;
    },
}

export default auth_state;
