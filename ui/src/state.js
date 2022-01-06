let auth_state = {
    state: {
        uname: "",
        viewApprove: false,
        viewExpenses: false,
        viewDonation: false,
        viewTreasurer: false,
        viewIncome: false,
    },
    newAuthState(newAuth) {
        localStorage.setItem('uname', newAuth.uname);
        this.state.uname = newAuth.uname;
        this.state.viewApprove = newAuth.viewApprove;
        this.state.viewExpenses = newAuth.viewExpenses;
        this.state.viewDonation = newAuth.viewDonation;
        this.state.viewTreasurer = newAuth.viewTreasurer;
        this.state.viewIncome = newAuth.viewIncome;
    },
    setAuthState(newAuth) {
        this.state.uname = newAuth.uname;
        this.state.viewApprove = newAuth.viewApprove;
        this.state.viewExpenses = newAuth.viewExpenses;
        this.state.viewDonation = newAuth.viewDonation;
        this.state.viewTreasurer = newAuth.viewTreasurer;
        this.state.viewIncome = newAuth.viewIncome;
    },
    clearAuthState() {
        localStorage.removeItem('uname');
        document.cookie="apikey=; max-age=-1; SameSite=Strict; path='/'";
        this.state.uname = '';
        this.state.viewApprove = false;
        this.state.viewExpenses = false;
        this.state.viewDonation = false;
        this.state.viewTreasurer = false;
        this.state.viewIncome = false;
    }
}

export default auth_state;
