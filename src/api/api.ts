import axios from 'axios';

export const proxy = <T>(url: string, method: string, headers: any, body?: any, params?: any) => {
  return axios.post<T>(process.env.REACT_APP_PROXY, { url, method, headers, body, params });
};
