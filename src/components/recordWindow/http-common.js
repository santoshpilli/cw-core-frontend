import axios from "axios";
// import { genericUrl } from "../../constants/serverConfig";

const genericUrl = process.env.REACT_APP_genericUrl;
let localToken = JSON.parse(localStorage.getItem("authTokens"));
export default axios.create({
  baseURL: genericUrl,
  headers: {
    "Content-type": "application/json",
    'Authorization': `bearer ${localToken}`
  }
});