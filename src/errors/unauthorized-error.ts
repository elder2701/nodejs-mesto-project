import { constants } from 'http2';

class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message = 'Не верный пользователь или пароль') {
    super(message);
    this.statusCode = constants.HTTP_STATUS_UNAUTHORIZED;
  }
}

export default UnauthorizedError;
