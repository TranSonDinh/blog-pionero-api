import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) { }

  async signUp(username: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
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
    const user = this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
