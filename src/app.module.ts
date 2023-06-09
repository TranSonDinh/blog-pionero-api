import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "Sondinh2000@",
    database: "blog",
    entities: [User],
    synchronize: true,
  }), 
  UsersModule,
  PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
