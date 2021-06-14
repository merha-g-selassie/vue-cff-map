import { AxiosError } from 'axios';
import { CustomError } from '@/types';
import { REQUEST_FAILED } from '@/constants';

export const requestError = (err: AxiosError): CustomError => {
  let error: CustomError;

  if (err.response) {
    const { status, data } = err.response;

    error = {
      code: status,
      message: data.error,
    };
  } else {
    error = {
      code: REQUEST_FAILED,
      message: err.message,
    };
  }
  return error;
};
