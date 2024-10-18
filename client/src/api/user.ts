import axios from 'axios';
import { BaseUrl } from '../constant';

interface IUser {
  id: string;
  username: string;
  isAdmin: boolean;
}

export const getUser = async (userId: string): Promise<IUser> => {
  const response = await axios.get(`${BaseUrl}user/${userId}`, { withCredentials: true });
  return response.data.data;
};

export const updateUser = async (userId: string, userData: Partial<IUser>): Promise<IUser> => {
  const response = await axios.patch(`${BaseUrl}user/${userId}`, userData, { withCredentials: true });
  return response.data.data;
};

export const deleteUser = async (userId: string): Promise<void> => {
  await axios.delete(`${BaseUrl}user/${userId}`, { withCredentials: true });
};