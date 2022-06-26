
import axios, { AxiosError, AxiosResponse } from 'axios';
import { API_KEY, API_URL } from 'config';
import { ReactElement, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  },
  timeout: 3000,
});

const AxiosInterceptor = ({ children }: { children: ReactElement }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const resInterceptor = (response: AxiosResponse): AxiosResponse => {
      return response;
    };

    const errInterceptor = (error: AxiosError): Promise<AxiosError> => {
      if (error?.response?.status === 401) {
        navigate('/');
      } else if (error?.response?.status === 403) {
        navigate('/');
      }
      return Promise.reject(error);
    };

    const interceptor = instance.interceptors.response.use(
      resInterceptor,
      errInterceptor,
    );

    return () => instance.interceptors.response.eject(interceptor);
  }, [navigate]);

  return children;
};

export default instance;
export { AxiosInterceptor };
