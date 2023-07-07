import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from './User';

@Entity()
export class FavoriteSongs  {
    @PrimaryColumn({
        type:'uuid'
    })
    id!:string;

    @Column({
        type:'varchar'
    })
    track_name!: string

    @Column("text",{
    })
    artist_names!: string

    @Column({
        type:'varchar'
    })
    album?:string

    @Column({
        type:'varchar'
    })
    url_track!:string
    
    @Column({
        type:'int'
    })
    duration_ms!:number
    @Column({
        type:'varchar'
    })
    image_preview_max!:string

    @Column({
        type:'varchar'
    })
    image_preview_min!:string
    @Column({
        type:'uuid'
        
    })
    music_api_id!:string

    @ManyToOne(()=>User,(user_id)=>user_id.favorite_songs)
    user_id?:User
}


