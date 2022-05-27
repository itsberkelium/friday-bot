import dotenv from "dotenv";
import Axios from "axios";

const url = process.env.URL || "http://localhost:3000";

const API = Axios.create({
  baseURL: `${url}`,
});

module.exports = API;
