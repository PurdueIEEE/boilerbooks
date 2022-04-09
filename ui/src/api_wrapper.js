import auth_state from '@/state';
import router from '@/router/index';

async function fetchWrapperJSON(url, fetch_opts) {
    try {
        const response = await fetch(url, fetch_opts);
        if (response.status === 401) {
            auth_state.clearAuthState();
            router.replace('/login');
            return {error:true, response:''};
        }

        if (!response.ok) {
            const responseTxt = await response.text();
            return {
                error:true,
                response: responseTxt,
            };
        } else {
            const responstJson = await response.json();
            return {
                error:false,
                response: responstJson,
            }
        }
    } catch (err) {
        console.log(err);
        return {
            error:true,
            response:"Network Error",
        }
    }
}

async function fetchWrapperTXT(url, fetch_opts) {
    try {
        const response = await fetch(url, fetch_opts);
        if (response.status === 401) {
            auth_state.clearAuthState();
            router.replace('/login');
            return {error:true, response:''};
        }

        const responseTxt = await response.text();
        return {
            error:!response.ok,
            response: responseTxt,
        };
    } catch (err) {
        console.log(err);
        return {
            error:true,
            response:"Network Error",
        }
    }
}

export { fetchWrapperJSON, fetchWrapperTXT };