import axios from "axios"
import { BaseUrl } from "../constant"


export const userLogin = async(username:string, password:string) => { 
    const response = await axios.post(`${BaseUrl}auth/login`, {username, password}, {withCredentials: true})
    // console.log('Login stuff', response)
    return response.data
}

export const userLogout = async() => { 
    const response = await axios.post(`${BaseUrl}auth/logout`)
    return response
}

export const userRegister = async(username:string, password:string, isAdmin: boolean) =>{ 
    const response = await axios.post(`${BaseUrl}auth/register`, {username, password, isAdmin})
    return response.data
}