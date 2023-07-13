
import { logger } from '../../infra/logger';
import { spotifyApi } from './urlSpotify';
import { APIFavoriteSongs } from '../../interfaces/ApiFavoriteSongs';

export const getTopTracks = async(limit:number,offset:number,token:string) =>{
        const {data} = await spotifyApi.get<APIFavoriteSongs>(`/me/top/tracks?limit=${limit}&offset=${offset}`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        });
        return data;
}