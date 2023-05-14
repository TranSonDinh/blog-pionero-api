import { Body, ConflictException, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { UsersService } from './user.service';

@Controller()
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Post('sign-up')
    async signUp(@Body() signUpDto: CreateUserDto) {
        const existingUser = await this.userService.findUserByUserName(
            signUpDto.username,
        );
        if (existingUser) {
            throw new ConflictException('Username already exists');
        }
        const user = await this.userService.signUp(signUpDto.username, signUpDto.password);
        return user;
    }

    @Post('sign-in')
    async signIn(@Body() signUpDto: SignInDto) {
        const { accessToken } = await this.userService.signIn(signUpDto);

        if (!accessToken) {
            throw new UnauthorizedException('Invalid username or password');
        }
        return { accessToken }
    }
}
