import path from 'path'
import dotenv from 'dotenv';
dotenv.config()

export default {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    logging: false,
    entities: [path.join(__dirname, String(process.env.TYPEORM_ENTITY_PATH))],
    migrations: [],
    synchronize:true,
}