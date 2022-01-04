let auth_state = {
    state: {
        uname: "",
        apikey: "",
        p_approvePerm: false,
    },
    newAuthState(newAuth) {
        document.cookie=`apikey=${newAuth.apikey}; max-age=${60*60*24}; SameSite=Strict; path='/'`;
        document.cookie=`uname=${newAuth.uname}; max-age=${60*60*24}; SameSite=Strict; path='/'`;
        this.state.uname = newAuth.uname;
        this.state.apikey = newAuth.apikey;
        this.state.p_approvePerm = newAuth.p_approvePerm;
    },
    setAuthState(newAuth) {
        this.state.uname = newAuth.uname;
        this.state.apikey = newAuth.apikey;
        this.state.p_approvePerm = newAuth.p_approvePerm;
    },
    clearAuthState() {
        document.cookie="apikey=; max-age=-1; SameSite=Strict; path='/'";
        document.cookie="uname=; max-age=-1; SameSite=Strict; path='/'";
        this.state.uname = '';
        this.state.apikey = '';
        this.state.p_approvePerm = false;
    }
}

export default auth_state;
