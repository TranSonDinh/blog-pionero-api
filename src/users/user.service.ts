import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Connection } from 'mysql2';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly connection: Connection,
    private jwtService: JwtService,
  ) { }

  async signUp(username: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.connection.query(`INSERT INTO user (username, password) VALUES ('${username}', '${hashedPassword}');`)
    const user = await this.findUserByUserName(username);
    delete user.password
    return user;
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.findUserByUserName(username);
    if (user && bcrypt.compare(password, user.password)) {
      return user;
    }
    throw new UnauthorizedException('Invalid email or password');
  }

  async signIn({ username, password }: { username: string, password: string }): Promise<{ accessToken: string }> {
    const user = await this.validateUser(username, password);
    if (user) {
      const accessToken = this.jwtService.sign({ username, password });
      return { accessToken };
    }
  }

  async findUserByUserName(username: string): Promise<User> {
    const user = await this.connection.query(`SELECT * FROM user WHERE username = '${username}' LIMIT 1;`);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user[0];
  }
}
