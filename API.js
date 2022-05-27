const dotenv = require("dotenv").config();
const { default: Axios } = require("axios");

const url = process.env.URL || "http://localhost:3000";

const API = Axios.create({
  baseURL: `${url}`,
});

module.exports = API;
