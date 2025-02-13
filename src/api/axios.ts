/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";

export const localhost = "https://jml-server.onrender.com/"
export const production = "http://3.80.143.15:3000/"
export default axios.create({
    baseURL: localhost,
    // timeout: 10000,
})