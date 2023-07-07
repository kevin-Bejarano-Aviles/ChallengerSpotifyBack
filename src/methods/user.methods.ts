import mysql from '../infra/mysql/index';
import { User } from '../entity/User';
import { v4 as uuid } from 'uuid';
const dataTypeOrm = mysql.dataMysql();

export const createUser = async(username:string,email:string)=>{
    const newUser = dataTypeOrm.manager.create(User,{
        id:uuid(),
        user_name:username,
        email:email
    });
    await dataTypeOrm.manager.save(newUser);
}

export const findOneUser = async(id:string)=>{
    const user = await dataTypeOrm.manager.findOne(User,{
        where:{
            id
        }
    })
    return user;
}
export const findAllUser = async ()=>{
    const users = await dataTypeOrm.manager.find(User);

    return users;
}

export const findByEmailOrCreateUser = async(username?:string,email?:string)=>{
    const user = await dataTypeOrm.manager.findOne(User,{
        where:{
            email
        }
    })
    if(!user){
        const newUser = dataTypeOrm.manager.create(User,{
            id:uuid(),
            user_name:username,
            email:email
        });
        await dataTypeOrm.manager.save(newUser);
        return newUser;
    }
    
    return user;
    
}
