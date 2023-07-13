// const errorName = {
//   USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
//   SERVER_ERROR: 'SERVER_ERROR',
// };

enum errorNameType {
	EMAIL_NOT_FOUND = "EMAIL_NOT_FOUND",
	SERVER_ERROR = 'SERVER_ERROR',
	PASSWORD_IS_INCORRECT = 'PASSWORD_IS_INCORRECT' 
}

const errorType = {
  EMAIL_NOT_FOUND: {
    message: 'Email not found.',
    statusCode: 404,
  },
  SERVER_ERROR: {
    message: 'Server error.',
    statusCode: 500,
  },
  PASSWORD_IS_INCORRECT: {
    message: 'Password is incorrect.',
    statusCode: 401,
  },
};

export { errorNameType, errorType };
