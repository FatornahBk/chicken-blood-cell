import axios from 'axios';

const addAuthInterceptor = (client) => {
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  return client;
};

export const predictClient = addAuthInterceptor(axios.create({  
  baseURL: 'http://localhost/ai',
}));

export const registerClient = addAuthInterceptor(axios.create({  
  baseURL: 'http://localhost/api',
}));

export const loginClient = addAuthInterceptor(axios.create({  
  baseURL: 'http://localhost/api',
}));

export const uploadClient = addAuthInterceptor(axios.create({  
  baseURL: 'http://localhost/api',
}));