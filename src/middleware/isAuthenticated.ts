import { NextFunction, Request, Response } from "express";
import { logger } from '../infra/logger';

export const isAuthentticated = (req:Request,res:Response,next:NextFunction)=>{
    try {
        
        if(!req.isAuthenticated()){
            // console.log(req.user);
            
            // console.log(`te deslogeaste en ${req.url}`);
            
            return res.status(401).json({
                msg:'user not logged or token expired'
            })
        }
        // console.log(req.user);
        
        return next()
    } catch (error) {
        logger.error(error as string);
    }
}