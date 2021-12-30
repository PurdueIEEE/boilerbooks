let auth_state = {
    state: {
        id: "",
        fname: "",
        lname: "",
        uname: "",
        email: "",
    },

    setAuthState(newAuth) {
        this.state = {
            id: newAuth.id,
            fname: newAuth.fname,
            lname: newAuth.lname,
            uname: newAuth.uname,
            email: newAuth.email,
        };
    },
    clearAuthState() {
        this.state = {
            id: '',
            fname: '',
            lname: '',
            uname: '',
            email: '',
        };
    }
}

export default auth_state;
