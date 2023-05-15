import { Body, Controller, Post } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';

@Controller("post")
export class PostsController {
    constructor(private readonly postService: PostsService) { }

    @Post('create')
    async create(@Body() createPostDto: CreatePostDto) {
        const post = await this.postService.create(createPostDto.title, createPostDto.content);
        return post;
    }
}
