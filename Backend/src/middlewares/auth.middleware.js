import jsonwebtoken from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler';
import ApiError from '../utils/ApiError';
import ApiResponse from '../utils/ApiResponse';
import User from '../models/user.models';

const authMiddleware = asyncHandler(async(req, res, next)=>{
    const token = req.headers.authorization;
    if(!token){
        return next(new ApiError(401, 'Unauthorized'));
    }
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if(!user){
        return next(new ApiError(401, 'Unauthorized'));
    }
    req.user = user;
    next();
});
export default authMiddleware;