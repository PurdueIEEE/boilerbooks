let DataTableMixin = {
  data() {
    return {
      currPageRaw: 0,
      maxElemPerPage: 10,
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
