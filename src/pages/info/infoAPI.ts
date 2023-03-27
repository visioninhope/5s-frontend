import axios from 'axios';
import { proxy } from '../../api/api';
import { OrderRequest } from '../../storage/orderViewCustomer';

export const getCompanyVersionAPI = (hostname: string, cookies: string) => {
  const API_VERSION = 'api/company/version/';

  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy<OrderRequest>(`${process.env.REACT_APP_NGROK}${API_VERSION}`, 'GET', {
      Authorization: cookies,
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.get(process.env.REACT_APP_IP_SERVER + API_VERSION, {
      headers: {
        Authorization: cookies,
      },
    });
  } else {
    return axios.get(`http://${hostname}/${API_VERSION}`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};
