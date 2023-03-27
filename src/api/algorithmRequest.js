import axios from 'axios';
import { proxy } from './api';

const API_ALGORITHM = 'api/algorithms/available-process/';
const API_POSTALGORITHM = 'api/algorithms/create-process/';
const API_DELPROCESS = 'api/algorithms/stop-process/';
const API_GETPROCESS = 'api/algorithms/get-process/';
const API_GETLOGS = 'api/algorithms/logs/';

export const getAveilableAlgorithms = (hostname, cookies) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy(process.env.REACT_APP_NGROK + API_ALGORITHM, 'GET', {
      Authorization: cookies,
    });
  } else {
    return axios.get(`http://${hostname}/${API_ALGORITHM}`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};

export const postAlgorithnDependences = async (hostname, cookies, response) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return axios.post('https://5scontrol.pl/proxy_to_ngrok', {
      url: process.env.REACT_APP_NGROK + API_POSTALGORITHM,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
      },
      body: JSON.stringify(response),
    });
  } else {
    return axios.post(`http://${hostname}/${API_POSTALGORITHM}`, response, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
      },
    });
  }
};

export const deleteProcess = (hostname, cookies, pid) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return axios.post('https://5scontrol.pl/proxy_to_ngrok', {
      url: process.env.REACT_APP_NGROK + API_DELPROCESS,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
      },
      body: JSON.stringify({
        pid: pid,
      }),
    });
  } else {
    return axios.post(
      `http://${hostname}/${API_DELPROCESS}`,
      {
        pid: pid,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: cookies,
        },
      }
    );
  }
};

export const getProcess = (hostname, cookies) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy(process.env.REACT_APP_NGROK + API_GETPROCESS, 'GET', {
      Authorization: cookies,
    });
  } else {
    return axios.get(`http://${hostname}/${API_GETPROCESS}`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};

export const getLogs = (hostname, cookies) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy(process.env.REACT_APP_NGROK + API_GETLOGS, 'GET', {
      Authorization: cookies,
    });
  } else {
    return axios.get(`http://${hostname}/${API_GETLOGS}`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};
