// import { SSOURL } from "./serverConfig";
const SSOURL = process.env.REACT_APP_SSOURL;
const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
        return null;
    }
};

export const getOAuthHeaders = () => {
    const currentTime = Date.now() / 1000;
    const cookies = document.cookie.split('; ');
    let access_token;
    let refresh_token;
    let email;
    let tenantId;
    let tenantName;
    let Enterprise;
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split('=');
        // console.log(cookie);
        const name = cookie[0];
        const value = cookie[1];
        if (name.search('accessToken') > 0) {
            access_token = value;
        };
        if (name.search('refreshToken') > 0) {
            refresh_token = value;
        };
        if (name.search('LastAuthUser') > 0) {
            email = decodeURIComponent(value);
        };
        if (name === "tenantId") {
            tenantId = value;
        };
        if (name === "tenantName") {
            tenantName = value;
        };
        if(name === "Enterprise"){
            Enterprise=value
        }  
    };

    if (!access_token && !refresh_token) {
        window.location.assign(`${SSOURL}?redirect_uri=${window.location.href}`);
      } else {
        const decodedToken = parseJwt(access_token);
        let tokenExpirationTime = decodedToken?.exp; 
            if (tokenExpirationTime < currentTime) {
                window.location.assign(`${SSOURL}refresh-token/?redirect_uri=${window.location.href}`);
            }
         else {
            return {
                access_token: access_token,
                email: email,
                tenantId: tenantId,
                tenantName: tenantName,
                Enterprise:Enterprise
            };
        };
    };
};
