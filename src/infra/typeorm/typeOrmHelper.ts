import 'reflect-metadata';
import { createConnection, getConnectionManager } from 'typeorm';

export class TypeOrmHelper {
  private static entities: any[] = [];

  static setupEntities(entities: any[]): void {
    this.entities = [...this.entities, ...entities];
  }

  static async getDomainConnection() {
    return this.getConnection(process.env.DB_SCHEMA);
  }

  private static async getConnection(schema: string): Promise<Connection> {
    try {
      const connectionManager = getConnectionManager();

      if (connectionManager.has(schema)) {
        const connection = connectionManager.get(schema);

        if (connection.isInitialized) {
          return connection;
        }

        return connection.initialize();
      } else {
        const connection = await createConnection({
          ssl: { rejectUnauthorized: false },
          type: 'mysql',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          name: schema,
          schema: schema,
          entities: this.entities,
          synchronize: true
        });

        return connection;
      }
    } catch (error: any) {
      console.log(error);
      //AppInsights.getInstance().exceptionLog(error);
      const newError = new Error('Not found connection, please try again');
      Logger.critical(newError, error);
      throw newError;
    }
  }
}
