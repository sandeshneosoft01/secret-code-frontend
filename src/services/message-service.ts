import { api } from './api';

export const getMessageByCode = async (code: string) => {
  try {
    const response = await api.get(`/api/v1/messages/by-code/${code}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'INTERNAL_ERROR' };
  }
};
