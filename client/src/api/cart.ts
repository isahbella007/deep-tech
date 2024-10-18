import axios from 'axios';
import { BaseUrl } from '../constant';


interface CartItem {
  productId: string;
  quantity: number;
}

interface Cart {
  _id: string;
  userId: string | null;
  cartId: string | null;
  items: CartItem[];
  // Add other cart properties as needed
}

export const getCart = async (): Promise<Cart> => {
  const response = await axios.get(`${BaseUrl}cart`, {withCredentials: true});
  return response.data.data;
};

export const addToCart = async (productId: number, quantity: number): Promise<Cart> => {
  console.log('add to cart called')
  const response = await axios.post(
    `${BaseUrl}cart/add`,
    { productId, quantity },
    {withCredentials: true}
  );
  console.log('Add to cart response', response.data)
  return response.data.data;
};

export const updateCart = async (productId: string, quantityChange: number): Promise<Cart> => {
  const response = await axios.patch(
    `${BaseUrl}cart/update`,
    { productId, quantityChange },
    {withCredentials: true}
  );
  return response.data.data;
};

export const deleteProduct = async(productId:string) => { 
  const response = await axios.delete(`${BaseUrl}cart/remove/${productId}`, {withCredentials:true})
  return response.data.data
}
export const clearCart = async (): Promise<Cart> => {
  const response = await axios.post(`${BaseUrl}cart/clear`, {});
  return response.data.data;
};