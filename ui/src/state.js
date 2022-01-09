let auth_state = {
    state: {
        uname: "",
        viewFinancials: false,
        viewApprove: false,
        viewOfficer: false,
        viewTreasurer: false,
    },
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
        document.cookie="apikey=; max-age=-1; SameSite=Strict; path='/'";
        this.state.uname = '';
        this.state.viewFinancials = false;
        this.state.viewApprove = false;
        this.state.viewOfficer = false;
        this.state.viewTreasurer = false;
    },
}

export default auth_state;
