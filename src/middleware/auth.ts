import  jwt, { JwtPayload }  from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

interface JWTUserPayload {
	"userId": string,
	"email": string,
	"iat": number,
	"exp": number
}



const auth  = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.get('Authorization');
	if (!authHeader) {
		req.isAuth = false;
		return next();
	}
	const token = authHeader.split(' ')[1];

	let decodedToken: string | JwtPayload;
	try {
		decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as JWTUserPayload
	} catch (err) {
		req.isAuth = false;
		return next();
	}
	if (!decodedToken) {
		console.log("no decoded token");
		
		req.isAuth = false;
		return next();
	
	}
	req.userId = decodedToken.userId;
	req.isAuth = true;
	next();
} 

export default auth;