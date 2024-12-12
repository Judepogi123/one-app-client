/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";

//export const localhost = "http://localhost:3000/"
export const production = "http://3.80.143.15:3000/"
export default axios.create({
    baseURL: production,
    timeout: 10000,
})