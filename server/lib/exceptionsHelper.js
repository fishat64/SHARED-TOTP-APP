const config = require('../../config.json');

class AuthError extends Error {
    constructor(message, forAdmin = "", ...params) {
        const name = `AuthError: ${message}`;
        const date = new Date();
        super(name, message, ...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AuthError);
        }

        this.date = date;
        this.message = message;
        this.forAdmin = `${date} ${name} ${forAdmin}`;
    }
  }


const UserNotFoundException = new AuthError(config.ErrorCodes.UserNotFound, "UserNotFound");
const PasswordWrongException = new AuthError(config.ErrorCodes.PasswordWrong, "PasswordWrong");

module.exports = { AuthError, UserNotFoundException, PasswordWrongException }