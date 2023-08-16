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
    message: 'Email не найден',
    statusCode: 404,
  },
  SERVER_ERROR: {
    message: 'Ошибка сервера.',
    statusCode: 500,
  },
  PASSWORD_IS_INCORRECT: {
    message: 'Пароль неверный',
    statusCode: 401,
  },
	NOT_AUTHORIZED: {
		message: 'Запрос неавторизован',
		statusCode: 401
	},
	EMAIL_IS_INCORRECT: {
    message: 'Email неверный.',
    statusCode: 422,
  },
	USER_EMAIL_EXISTS: {
    message: 'Пользователь с таким email уже существует',
    statusCode: 422,
  },
	COULD_NOT_PROCESS: {
    message: 'Сервер не смог обработать запрос',
    statusCode: 422,
  },
	PASSWORD_LENGTH_IS_INCORRECT: {
		message: 'Пароль должен содержать минимум 6 символов',
    statusCode: 422,
	},
	PASSWORDS_DO_NOT_MATCH: {
		message: 'Пароли не совпадают',
    statusCode: 422,
	}
	
};


export { errorNameType, errorType };
