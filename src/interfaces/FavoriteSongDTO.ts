export interface FavoriteSongsDTO {
    id:string;
    track_name:string,
    artist_names:string[],
    album:string,
    url_track: string,
    duration_ms:string,
    image_preview_max:string,
    image_preview_min:string,
    userId: string
}