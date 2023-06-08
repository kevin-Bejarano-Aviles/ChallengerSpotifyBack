import mysql from '../infra/mysql/index';
import { FavoriteSongs } from '../entity/FavoriteSongs';
const dataTypeOrm = mysql.dataMysql();
import {v4 as uuid} from 'uuid';
import { User } from 'entity/User';

export const createFavoriteSong = async(track_name:string,artist_names:string,album:string,url_track:string,userId:User)=>{
    const newFavoriteSong = dataTypeOrm.manager.create(FavoriteSongs,{
        id:uuid(),
        track_name,
        artist_names,
        album,
        url_track,
        user_id:userId
    });

    await dataTypeOrm.manager.save(newFavoriteSong);

    return newFavoriteSong;
}

export const findOneFavoriteSong = async(id:string)=>{
    const favoriteSong = await dataTypeOrm.manager.findOne(FavoriteSongs,{
        where:{
            id
        },
        relations:{
            user_id:true
        }

    });
    return favoriteSong;
}

export const findAllFavoriteSongsOfUser = async(idUser:string)=>{
    const favoriteSongs = await dataTypeOrm.manager.find(FavoriteSongs,{
        where:{
            user_id:{
                id:idUser
            }
        }
    });

    return favoriteSongs;
}


