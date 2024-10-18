import axios from "axios"
import { IProduct } from "../types";
import { BaseUrl } from "../constant";

// console.log(BaseUrl)

export const addProduct =  async(productData: IProduct) => {
    const response = await axios.post(`${BaseUrl}product`, productData, {withCredentials: true});
    return response.data;
}

export const getProduct = async (productId: string) => {
    const response = await axios.get(`${BaseUrl}product/${productId}`);
    return response.data;
};
  
export const getAllProducts = async () => {
    const response = await axios.get(`${BaseUrl}product`,  { withCredentials: true });
    // console.log('responseee', response.data)
    return response.data.data;
};

export const updateProduct = async (productId: number, productData: Partial<IProduct>) => {
    const response = await axios.patch(`${BaseUrl}product/${productId}`, productData, {withCredentials:true});
    return response.data;
};

export const deleteProduct = async (productId: number) => {
    const response = await axios.delete(`${BaseUrl}product/${productId}`, {withCredentials: true});
    return response.data;
};

export const allProductsNoLogin = async () => {
    const response = await axios.get(`${BaseUrl}user/products`, {withCredentials: true})
    // console.log('base no the problem', response)
    return response.data.data
}