import { Request, Response } from "express";
import { logger } from '../infra/logger';
import { UserReq } from '../interfaces/UserReq';


export const login = (req:Request,res:Response)=>{
    try {
        
        const user = req.user as UserReq;
        if(user){
            return res.status(200).json({
                user:{
                    id:user.id,
                    userName:user.user_name,
                    email:user.email
                },
                logged:true      
            });
        }
        return res.status(200).json({
            logged:false
        });
    } catch (error) {
        logger.error(error as string);
    }
}

export const logout = (req:Request,res:Response) =>{
    try {
        req.session.destroy((err)=>{
            if(err){
              return logger.error('Error al cerrar sesion:'+ err)
            }  
            res.clearCookie('cookie-spotify');
            res.status(200).json({
                msg:'user logout'
            });
        })
    } catch (error) {
        logger.error(error as string);
    }
}