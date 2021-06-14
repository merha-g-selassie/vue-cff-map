import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

export default abstract class HttpClient {
  protected readonly instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
    });

    this.initializeInterceptors();
  }

  private initializeInterceptors = () => {
    this.instance.interceptors.response.use(
      this.handleResponse,
      this.handleError,
    );
  };

  private handleResponse = (response: AxiosResponse) => response;

  protected handleError = (error: AxiosError) => Promise.reject(error);
}
