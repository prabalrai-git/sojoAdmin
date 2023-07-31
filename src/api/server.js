import axios from "axios";

// export const BASE_URL = process.env.REACT_APP_BASE_URL
//   ? process.env.REACT_APP_BASE_URL
//   : "http://localhost:8080/api/v1";

// export const BASE_URL = "http://localhost:3030/api/v1";
export const BASE_URL = "https://backendv1.sojonews.com/api/v1";
export default axios.create({
  baseURL: BASE_URL,
});
