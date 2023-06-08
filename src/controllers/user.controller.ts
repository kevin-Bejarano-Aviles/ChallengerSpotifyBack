import { Request, Response } from "express";
import { logger } from '../infra/logger';
import { findOneUser } from '../methods/user.methods';
import axios from "axios";
import { UserReq } from '../interfaces/UserReq';
import { DataFavoriteSongs } from "../interfaces/DataFavoriteSongs";
import { FavoriteSongsDTO } from '../interfaces/FavoriteSongDTO';
import { createFavoriteSong, findAllFavoriteSongsOfUser } from '../methods/favoriteSongs.methods';
/* users/ifmpis659udq2v84nyju1cdsw */
const url = "https://api.spotify.com/v1"

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
            // noe:req.user
        });
    } catch (error) {
        logger.error(error as string);
    }
}

export const userTopTracks = async(req:Request,res:Response)=>{
    try {
        const {id} = req.params;
        
        const user = await findOneUser(id);

        if(!user){
            return res.status(404).json({
                msg: 'User not found'
            });
        }
        const userReq = req.user as UserReq
        const data = await axios.get<DataFavoriteSongs>(`${url}/me/top/tracks`,{
            headers:{
                Authorization:`Bearer ${userReq.accessToken}`,
                "Content-Type":'application/json',

            }

        });
        const tracks = data.data.items.map(item=>{
            
            return  {
                albumName:item.album.name,
                urlSong: item.external_urls.spotify,
                trackName:item.name,
                artist: item.artists.map(item=>{return item.name})
            }
        });
        // res.json({tracks})
        res.status(200).json({
            tracks,
            msg:`All favorite songs of user ${user.user_name}`
        });
        

    } catch (error) {
        logger.error(error as string);
    }
}
    
export const addTrack = async(req:Request,res:Response)=>{
    try {
        const {id} = req.params;
        const {trackName,artist_names,album,urlTrack} = req.body as FavoriteSongsDTO;
        const artistsConvertString =JSON.stringify(artist_names)
        const user = await findOneUser(id);

        if(!user){
            return res.status(404).json({
                msg: 'User not found'
            });
        } 
        
        const song=  await createFavoriteSong(trackName,artistsConvertString,album,urlTrack,user)

        return res.status(201).json({
            song,
            msg:'Favorite Song add to Database'
        });

    } catch (error) {
        logger.error(error as string);
    }
}

export const getAllTrackOfUser = async(req:Request,res:Response)=>{
    try {
        const {id} = req.params;
        const user = await findOneUser(id);

        if(!user){
            return res.status(404).json({
                msg: 'User not found'
            });
        } 
        const tracks = await findAllFavoriteSongsOfUser(id)
        const newTracks = tracks.map(track => {
            return { ...track, artist_names:JSON.parse(track.artist_names)}
            
        })
        return res.status(200).json({
            newTracks,
            msg:'All tracks of database'
        })

    } catch (error) {
        logger.error(error as string);
    }
}