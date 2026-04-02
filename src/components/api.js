import axios from "axios";

const api = axios.create({
    baseURL:"http://localhost:3005/",
    withCredentials: true  // Enable sending cookies with requests
});

export default api;