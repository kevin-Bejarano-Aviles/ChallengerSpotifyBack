import { Request, Response } from "express";
import { logger } from '../infra/logger';
import { UserReq } from '../interfaces/UserReq';



export const login = (req:Request,res:Response)=>{
    try {
        
        const user = req.user as UserReq;
        
        return res.status(200).json({
            
            user:{
                id:user.id,
                userName:user.user_name,
                email:user.email
            }/* {
                id:user.id,
                userName:user.userName
            }     */       
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