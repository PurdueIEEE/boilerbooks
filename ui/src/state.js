let auth_state = {
    state: {
        uname: "",
        apikey: "",
        p_approvePerm: false,
    },

    setAuthState(newAuth) {
        this.state.uname = newAuth.uname;
        this.state.apikey = newAuth.apikey;
        this.state.p_approvePerm = newAuth.p_approvePerm;
    },
    clearAuthState() {
        this.state.uname = '';
        this.state.apikey = '';
        this.state.p_approvePerm = false;
    }
}

export default auth_state;
