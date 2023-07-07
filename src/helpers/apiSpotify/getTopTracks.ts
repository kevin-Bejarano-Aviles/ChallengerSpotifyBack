
import { logger } from '../../infra/logger';
import { spotifyApi } from './urlSpotify';
import { APIFavoriteSongs } from '../../interfaces/ApiFavoriteSongs';
import axios from 'axios';

export const getTopTracks = async(limit:number,offset:number,token:string) =>{
        /* axios.interceptors.response.use(
            (response)=> response,
            (error) => {
                if(error.response && error.response.status === 401){

                }
            }
        ) */
        const {data} = await spotifyApi.get<APIFavoriteSongs>(`/me/top/tracks?limit=${limit}&offset=${offset}`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        });
        return data;
        // const err = error as AxiosError;
        // const dataError = err.response?.data as  
        // setErrors(laData.data.errors)
        // logger.error(error as string)
}