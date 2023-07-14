import  jwt, { JwtPayload }  from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';



const auth  = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.get('Authorization');
	if (!authHeader) {
		req.isAuth = false;
		return next();
	}
	const token = authHeader.split(' ')[1];
	let decodedToken: string | JwtPayload;
	try {
		decodedToken = jwt.verify(token, 'somesupersecretsecret')
	} catch (err) {
		req.isAuth = false;
		return next();
	}
	if (!decodedToken) {
		
		req.isAuth = false;
		return next();
	
	}
	// TODO: addUserId to req object
	// req.userId = decodedToken.userId;
	req.isAuth = true;
	next();
} 

export default auth;