import { Request, Response } from 'express';
import { logger } from '../infra/logger';
import { findAllUser, findOneUser } from '../methods/user.methods';
import { FavoriteSongsDTO,UserReq } from "../interfaces";
import { createFavoriteSong, deleteSong, findAllFavoriteSongsOfUser, findAndCountFavoriteSongs, findOneFavoriteSongForUser } from '../methods/favoriteSongs.methods';
import { getTopTracks } from '../helpers/apiSpotify/getTopTracks';
import { filterProps } from '../helpers/apiSpotify/filterProps';



export const allUsers =async(req:Request,res:Response)=>{
    try {
        const users = await findAllUser();

        return res.status(200).json({
            users,
            length:users.length
        });

    } catch (error) {
        res.status(500).json({
            msg:'SERVER ERROR'
        });
        logger.error(error as string);
    }
}

export const userProfile = async(req:Request,res:Response)=>{
    try {   
        const {id} = req.params
        const user = await findOneUser(id);
        if(!user){
            return res.status(404).json({
                msg: 'User not found'
            });
        }
        return res.status(200).json({
            user
        });
    } catch (error) {
        res.status(500).json({
            msg:'SERVER ERROR'
        });
        logger.error(error as string);
    }
}


export const spotifyTopTracks = async(req:Request,res:Response)=>{
    try {
        // console.log(req.user);
        
        const {id} = req.params;
        const {limit=5,offset=0} = req.query;
        const user = await findOneUser(id);
        const userReq = req.user as UserReq

        if(!user){
            return res.status(404).json({
                msg: 'User not found'
            });
        }
        if(user.id !== userReq.id){
            return res.status(403).json({
                msg:'You do not have permissions to view this information'
            })
        }

        

        
        const data = await getTopTracks(+limit,+offset,userReq.accessToken)
        const tracks = filterProps(data)
        return res.status(200).json({
                tracks:tracks,
                limit:+limit,
                offset:+offset,
                total:data?.total,
                msg:`user ${user.user_name}'s favorite songs on spotify`
        });
    } catch (error:any) {
        req.session.destroy((err)=>{
            if(err){
              return logger.error('Error al cerrar sesion:'+ err)
            }  
            res.clearCookie('cookie-spotify');
            res.redirect('/api/login')
        })
        res.status(500).json({
            msg:'SERVER ERROR'
        });
        logger.error(error as string);
        
    }
}
    
export const addTrackToDb = async(req:Request,res:Response)=>{
    try {
        const {id} = req.params;
        
        const {id:idTrack,track_name,artist_names,album,url_track,duration_ms,image_preview_max,image_preview_min} = req.body as FavoriteSongsDTO;
        const artistsConvertString = JSON.stringify(artist_names)
        const user = await findOneUser(id);

        if(!user){
            return res.status(404).json({
                msg: 'User not found'
            });
        } 
        const song = await createFavoriteSong(
        idTrack,track_name,artistsConvertString,album,url_track,
        +duration_ms,image_preview_max,image_preview_min,user);

        return res.status(201).json({
            song,
            msg:'Favorite Song add to Database'
        });

    } catch (error) {
        res.status(500).json({
            msg:'SERVER ERROR'
        });
        logger.error(error as string);
    }
}

export const allTracksOfDb = async(req:Request,res:Response)=>{
    try {
        const {id} = req.params;
        const {limit=5,offset=0} = req.query;
        const user = await findOneUser(id);

        if(!user){
            return res.status(404).json({
                msg: 'User not found'
            });
        } 
        const [tracks,number] = await findAllFavoriteSongsOfUser(user.id,+limit,+offset);
        const newTracks = tracks.map(track => {
            return { ...track, artist_names:JSON.parse(track.artist_names)}
            
        })
        return res.status(200).json({
            newTracks,
            number,
            limit:+limit,
            offset:+offset,
            msg:'All tracks of database'
        })

    } catch (error) {
        res.status(500).json({
            msg:'SERVER ERROR'
        });
        logger.error(error as string);
    }
}
export const findOneSong = async(req:Request,res:Response)=>{
    try {
        const {idUser,idSong} = req.params;

        const song = await findOneFavoriteSongForUser(idSong,idUser);


        if(!song){
            return res.status(404).json(
                {msg:"music don't exist in your database"}
            )
        }
        
        return res.status(200).json({
            song
        });

    } catch (error) {
        res.status(500).json({
            msg:'SERVER ERROR'
        });
        logger.error(error as string);
    }
}

export const searchSongOnDb = async(req:Request,res:Response) =>{
    try {
        const {q =''} = req.query;
        const cosa = String(q)
        const [tracks,total] = await findAndCountFavoriteSongs(cosa);
        if(typeof tracks === 'undefined'){
            const arrayVoid:any = []
            return  res.status(200).json({
                tracks:arrayVoid
            })
        }
        return res.status(200).json({
            tracks,
            total
        })

    } catch (error) {
        res.status(500).json({
            msg:'SERVER ERROR'
        });
        logger.error(error as string);
    }
}
export const deleteSongOnDb = async(req:Request,res:Response)=>{
    try {
        const {idUser,idTrack} = req.params;

        const user = await findOneUser(idUser);

        if(!user){
            return res.status(404).json({
                msg: 'User not found'
            });
        } 

        const track = await deleteSong(idTrack);

        return res.status(200).json({
            msg:`Track of user ${user.user_name} deleted`,
            track
        })  ;
    } catch (error) {
        res.status(500).json({
            msg:'SERVER ERROR'
        });
        logger.error(error as string);
    }
}