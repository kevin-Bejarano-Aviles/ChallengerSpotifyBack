import mysql from '../infra/mysql/index';
import { User } from '../entity/User';
const dataTypeOrm = mysql.dataMysql();

export const createUser = async(id:string,username:string,email:string)=>{
    const newUser = dataTypeOrm.manager.create(User,{
        id:id,
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
    const users = await dataTypeOrm.manager.find(User,{
        relations:{
            favorite_songs:true
        }
    });

    return users;
}

/* export const findOrCreateUser = async(id:string,username?:string,email?:string)=>{
    const user = await dataTypeOrm.manager.findOne(User,{
        where:{
            id
        }
    })
    if(!user){
        const newUser = dataTypeOrm.manager.create(User,{
            id:id,
            user_name:username,
            email:email
        });
        await dataTypeOrm.manager.save(newUser);
        return newUser;
    }
    
    return user;
    
}
 */