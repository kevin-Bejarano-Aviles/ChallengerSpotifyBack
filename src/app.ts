import 'reflect-metadata';
import mysqlConnection from './infra/mysql'
import expressServer from './infra/express'
import { iServer } from './infra/iServer';
import { iDatabase } from './infra/iDatabase';

function bootstrap (server: iServer, dbConnection: iDatabase) {
  server.start();

  dbConnection.start();
  
}

bootstrap(expressServer, mysqlConnection);