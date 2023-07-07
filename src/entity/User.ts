import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { FavoriteSongs } from './FavoriteSongs';

@Entity()
export class User {
    @PrimaryColumn({
        type:'uuid'
    })
    id!: string

    @Column({
        type:'varchar'
    })
    user_name!: string

    @Column({
        type:'varchar'
    })
    email!:string

    @OneToMany(()=>FavoriteSongs,(favorite_songs)=>favorite_songs.user_id)
    favorite_songs?:FavoriteSongs
}