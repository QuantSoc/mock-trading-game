import { BACKEND_ROUTE } from './constants';

export const fetchAPIRequest = async (route, method, bodyData = {}) => {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    if (method === 'GET') {
      // append payload to path
    } else {
      options.body = JSON.stringify(bodyData);
    }

    if (localStorage.getItem('token')) {
      options.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    }

    const response = await fetch(`${BACKEND_ROUTE}${route}`, options);
    const data = await response.json();
    // if (data.error === 'Session ID is not an active session') {
    //   console.log(data.error);
    //   return data;
    // }
    if (data.error === 'Failed to fetch') {
      console.log(data.error);
      return;
    }
    if (data.error === 'Invalid Token') {
      localStorage.removeItem('token');
      window.location.reload();
      return;
    }
    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    alert(error);
  }
};
