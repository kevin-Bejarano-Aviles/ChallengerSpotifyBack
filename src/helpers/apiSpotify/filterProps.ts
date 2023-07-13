import { APIFavoriteSongs } from "interfaces/ApiFavoriteSongs";

export const filterProps = (data:APIFavoriteSongs)=>{
   const tracks =  data.items.map(item=>{
        return {
            id: item.id,
            artist_names: item.artists.map(item=>{return item.name}),
            track_name:item.name,
            album:item.album.name,
            url_track: item.external_urls.spotify,
            image_preview_max: item.album.images[1].url,
            image_preview_min: item.album.images[2].url,
            duration_ms:item.duration_ms
        }
        
    });
    return tracks
}