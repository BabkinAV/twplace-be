import { errorType, errorNameType } from "../constants/ErrorTypes";

const getErrorCode = (errorName: errorNameType ) => {
  return errorType[errorName]
}

export {getErrorCode}