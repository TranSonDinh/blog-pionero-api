import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection } from "mysql2";
import { Post } from "./entities/post.entity";

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private readonly connection: Connection,

    ) {}

    async create (title: string, content: string): Promise<Post> {
        const post = await this.connection.query(`INSERT INTO post (title, content) VALUES ('${title}', '${content}');`)
        return post[0]
    }

    async findPostById(id: number): Promise<Post> {
        const post = await this.connection.query(`SELECT * FROM post WHERE id = '${id}' LIMIT 1;`);
        if (!post) {
          throw new NotFoundException('Post not found');
        }
        return post[0];
      }
}