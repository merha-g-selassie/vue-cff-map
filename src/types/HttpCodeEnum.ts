enum HttpCodeEnum {
  Ok = 200,
  Created = 201,
  ValidationError = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Malformed = 422,
  ServerError = 500,
  NetworkError = 'Failed',
}

export default HttpCodeEnum;
