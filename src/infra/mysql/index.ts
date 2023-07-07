import "reflect-metadata";
import { DataSource } from 'typeorm';
import { iDatabase } from "../iDatabase";
import path from 'path'
import dotenv from 'dotenv';
import { logger } from "../logger";
dotenv.config()

class MySqlConnection implements iDatabase {
    private dataSource: DataSource;
    private static instance: MySqlConnection;

    constructor() {
        this.dataSource = new DataSource({
            type: 'mysql',
            // host:'localhost',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            logging:false,
            entities: [path.join(__dirname, String(process.env.TYPEORM_ENTITY_PATH))],
            migrations: [],
            synchronize:true,
        })
    };

    public dataMysql (){
        return this.dataSource;
    }
    public static getInstance(): MySqlConnection {
        if (!MySqlConnection.instance) {
            MySqlConnection.instance = new MySqlConnection();
        }
        return MySqlConnection.instance;
    }

    public start() {
        this.dataSource.initialize()
            .then(() => logger.info('Database connection successfully.'))
            .catch((error: Error) => logger.error('Database connection error: ' + error.message))
            // console.log(path.join(__dirname, String(process.env.TYPEORM_ENTITY_PATH)));
    }
}

export default MySqlConnection.getInstance();
