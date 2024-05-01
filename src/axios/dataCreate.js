import axios from "axios";

const dataCreate = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 1000,
  headers: { "Actions-data": "requests" },
});

export default dataCreate;
