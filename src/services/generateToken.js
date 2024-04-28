import { getOAuthHeaders } from "../constants/oAuthValidation";
const SSOURL = process.env.REACT_APP_SSOURL;

export const generateToken = () => {
  window.location.assign(`${SSOURL}refresh-token/?redirect_uri=${window.location.href}`);
};