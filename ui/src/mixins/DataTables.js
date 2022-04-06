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

let DataTableMixin = {
  data() {
    return {
      currPageRaw: 0,
      maxElemPerPage: 10,
      deprecated: console.warn("[DataTableMixin] Deprecated, use components/DataTable.vue"),
    }
  },
  computed: {
    currPage() {
      if (this.currPageRaw > this.maxPage) {
        this.currPageRaw = this.maxPage;
        return this.maxPage
      }
      return this.currPageRaw;
    },
    paginatedData() {
      if (this.rows.length < this.maxElemPerPage) {
        return this.rows;
      }
      return this.rows.slice((this.currPage) * this.maxElemPerPage, (this.currPage + 1) * this.maxElemPerPage);
    },
    maxPage() {
      if (this.rows.length == 0) return 0;
      return Math.floor((this.rows.length - 1) / this.maxElemPerPage);
    },
    currPageEnd() {
      if (this.currPage == this.maxPage) {
        return this.rows.length
      }
      return (this.currPage+1)*this.maxElemPerPage
    },
    currPageStart() {
      if (this.rows.length == 0) return 0;
      return (this.currPage*this.maxElemPerPage) + 1;
    }
  }
}

export default DataTableMixin;
