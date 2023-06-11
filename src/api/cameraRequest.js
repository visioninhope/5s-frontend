import axios from 'axios';
import { proxy } from './api';

const API_CAMERASELECT = 'api/camera-algorithms/camera/';
const API_CAMERACREATE = 'api/cameras/create-camera/';
const API_CAMERADELETE = 'api/camera-algorithms/delete-camera/';
const API_CAMERAFIND = 'api/core/find_cameras/';
const API_CAMERACHECK = 'check_camera/';
const API_CAMERAZONES = 'api/camera-algorithms/zone/';
export const getSelectedCameras = (hostname, cookies) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy(process.env.REACT_APP_NGROK + API_CAMERASELECT, 'GET', {
      'Content-Type': 'application/json',
      Authorization: cookies,
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.get(`${process.env.REACT_APP_IP_SERVER}${API_CAMERASELECT}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
      },
    });
  } else {
    return axios.get(`http://${hostname}/${API_CAMERASELECT}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
      },
    });
  }
};

export const postCamera = (hostname, IPCamera, username, password, cookies) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return axios.post(process.env.REACT_APP_PROXY, {
      url: `${process.env.REACT_APP_NGROK + API_CAMERACREATE}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
      },
      body: JSON.stringify({
        ip: IPCamera,
        username: username,
        password: password,
        url: 'http://192.168.1.110',
      }),
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.post(
      `${process.env.REACT_APP_IP_SERVER}${API_CAMERACREATE}`,
      {
        ip: IPCamera,
        username: username,
        password: password,
        url: 'http://192.168.1.110',
      },
      {
        headers: {
          Authorization: cookies,
        },
      }
    );
  } else {
    return axios.post(
      `http://${hostname}/${API_CAMERACREATE}`,
      {
        ip: IPCamera,
        username: username,
        password: password,
        url: `http://${hostname}`,
      },
      {
        headers: {
          Authorization: cookies,
        },
      }
    );
  }
};

export const deleteCameraAPI = (hostname, cookies, IPCamera) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return axios.post(process.env.REACT_APP_PROXY, {
      url: `${process.env.REACT_APP_NGROK + API_CAMERADELETE + IPCamera}/`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
      },
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.delete(`${process.env.REACT_APP_IP_SERVER}${API_CAMERADELETE}${IPCamera}/`, {
      headers: {
        Authorization: cookies,
      },
    });
  } else {
    return axios.delete(`http://${hostname}/${API_CAMERADELETE}${IPCamera}/`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};

export const findCamera = (hostname) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy(process.env.REACT_APP_NGROK + API_CAMERAFIND, 'GET', {
      'Content-Type': 'application/json',
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.get(process.env.REACT_APP_IP_SERVER + API_CAMERAFIND);
  } else {
    return axios.get(`http://${hostname}/${API_CAMERAFIND}`);
  }
};

export const checkCamera = (hostname, cameraIP, username, password) => {
  return fetch(
    `http://${hostname.includes('localhost') ? '192.168.1.110' : hostname}:3456/${API_CAMERACHECK}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ip: cameraIP,
        username: username,
        password: password,
      }),
    }
  );
};

export const getCameraZones = (hostname, cookies, camera) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy(`${process.env.REACT_APP_NGROK}${API_CAMERAZONES}?camera=${camera}`, 'GET', {
      'Content-Type': 'application/json',
      Authorization: cookies,
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.get(`${process.env.REACT_APP_IP_SERVER}${API_CAMERAZONES}?camera=${camera}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
      },
    });
  } else {
    return axios.get(`http://${hostname}/${API_CAMERAZONES}?camera=${camera}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
      },
    });
  }
};

export const postCameraZones = (hostname, cookies, body) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return axios.post(process.env.REACT_APP_PROXY, {
      url: `${process.env.REACT_APP_NGROK + API_CAMERAZONES}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
      },
      body: JSON.stringify({
        body,
      }),
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.post(`${process.env.REACT_APP_IP_SERVER}${API_CAMERAZONES}`, body, {
      headers: {
        Authorization: cookies,
      },
    });
  } else {
    return axios.post(`http://${hostname}/${API_CAMERAZONES}`, body, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};
