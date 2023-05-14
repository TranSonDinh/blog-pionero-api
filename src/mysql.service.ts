import { Injectable } from '@nestjs/common';
import { mysqlConfig } from '../config/mysql.config';
import * as mysql from 'mysql2/promise';

@Injectable()
export class MysqlService {
  private connection;

  async getConnection() {
    if (!this.connection) {
      this.connection = await mysql.createConnection(mysqlConfig);
    }

    return this.connection;
  }

  async query(sql: string, params?: any[]) {
    const connection = await this.getConnection();
    const [rows, fields] = await connection.execute(sql, params);
    return rows;
  }
}
