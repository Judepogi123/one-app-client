/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";

const url = ["http://localhost:3000", "https://jml-server.onrender.com"];
export const localhost = url[1];
export const production = "http://3.80.143.15:3000/";
export default axios.create({
  baseURL: localhost,
  // timeout: 10000,
});
