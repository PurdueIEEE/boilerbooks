let auth_state = {
    state: {
        id: "",
        fname: "",
        lname: "",
        uname: "",
        email: "",
        p_approvePerm: false,
    },

    setAuthState(newAuth) {
        this.state.id = newAuth.id;
        this.state.fname = newAuth.fname;
        this.state.lname = newAuth.lname;
        this.state.uname = newAuth.uname;
        this.state.email = newAuth.email;
        this.state.p_approvePerm = newAuth.p_approvePerm;
    },
    clearAuthState() {
        this.state.id = '';
        this.state.fname = '';
        this.state.lname = '';
        this.state.uname = '';
        this.state.email = '';
        this.state.p_approvePerm = false;
    }
}

export default auth_state;
