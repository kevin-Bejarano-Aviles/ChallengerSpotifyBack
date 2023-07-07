import mysql from '../infra/mysql/index';
import { FavoriteSongs } from '../entity/FavoriteSongs';
const dataTypeOrm = mysql.dataMysql();
import {v4 as uuid} from 'uuid';
import { User } from 'entity/User';
import { Like } from 'typeorm';

export const createFavoriteSong = async(idApiSpotify:string,track_name:string,artist_names:string,album:string,url_track:string,duration_ms:number,image_preview_max:string,image_preview_min:string,userId:User)=>{
    const newFavoriteSong = dataTypeOrm.manager.create(FavoriteSongs,{
        id:uuid(),
        track_name,
        artist_names,
        album,
        url_track,
        duration_ms,
        image_preview_max,
        image_preview_min,
        user_id:userId,
        music_api_id:idApiSpotify
        
    });

    await dataTypeOrm.manager.save(newFavoriteSong);

    return newFavoriteSong;
}

export const findOneFavoriteSongForUser = async(idSong:string,idUser:string)=>{
    const favoriteSong = await dataTypeOrm.manager.findOne(FavoriteSongs,{
        where:
            [
            {
                id:idSong,
                user_id:
                {
                    id:idUser
                }
            },
            {
                music_api_id:idSong,
                user_id:
                {
                    id:idUser
                }
            }    
            ]

        ,
        relations:{
            user_id:true
        }

    });
    return favoriteSong;
}

export const findAllFavoriteSongsOfUser = async(idUser:string,limit:number,offset:number)=>{
    const favoriteSongs = await dataTypeOrm.manager.findAndCount(FavoriteSongs,{
        where:{
            user_id:{
                id:idUser
            }
        },
        take:limit,
        skip:offset

    });

    return favoriteSongs;
}

export const findAndCountFavoriteSongs = async(search:string)=>{
    if(search.trim()!==''){
        const songs = await dataTypeOrm.manager.findAndCount(FavoriteSongs,{
            where:[          
                {track_name: Like(`%${search}%`)},
                {album:Like(`%${search}%`)},
                // {artist_names:Like(`%${search}%`)}
            ],
            relations:{
                user_id:true
            }
        });
        return songs
    }
    
    return [];
}
export const deleteSong = async(id:string)=>{
    const song = await dataTypeOrm.manager.delete(FavoriteSongs,id);
    return song;
}