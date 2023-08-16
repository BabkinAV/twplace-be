// const errorName = {
//   USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
//   SERVER_ERROR: 'SERVER_ERROR',
// };

enum errorNameType {
	EMAIL_NOT_FOUND = "EMAIL_NOT_FOUND",
	SERVER_ERROR = 'SERVER_ERROR',
	PASSWORD_IS_INCORRECT = 'PASSWORD_IS_INCORRECT',
	NOT_AUTHORIZED = 'NOT_AUTHORIZED',
	EMAIL_IS_INCORRECT = 'EMAIL_IS_INCORRECT',
	PASSWORD_LENGTH_IS_INCORRECT = 'PASSWORD_LENGTH_IS_INCORRECT',
	USER_EMAIL_EXISTS = 'USER_EMAIL_EXISTS',
	COULD_NOT_PROCESS = 'COULD_NOT_PROCESS',
	PASSWORDS_DO_NOT_MATCH = 'PASSWORDS_DO_NOT_MATCH'
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
	NOT_AUTHORIZED: {
		message: 'Not authorized',
		statusCode: 401
	},
	EMAIL_IS_INCORRECT: {
    message: 'Email is incorrect.',
    statusCode: 422,
  },
	USER_EMAIL_EXISTS: {
    message: 'User email already exists',
    statusCode: 422,
  },
	COULD_NOT_PROCESS: {
    message: 'Server could not process your request',
    statusCode: 422,
  },
	PASSWORD_LENGTH_IS_INCORRECT: {
		message: 'Password should contain at least 6 characters',
    statusCode: 422,
	},
	PASSWORDS_DO_NOT_MATCH: {
		message: 'Passwords do not match',
    statusCode: 422,
	}
	
};


export { errorNameType, errorType };
