import validator from "validator";

 const sanitizeTextInput = (s: string) => {
	const trimmedString = validator.trim(s);

	const escapedString = validator.escape(trimmedString);

	return escapedString;
}



export default sanitizeTextInput;