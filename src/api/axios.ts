/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";

export const localhost = "http://localhost:3000/"
//const production = ""
export default axios.create({
    baseURL: localhost
})