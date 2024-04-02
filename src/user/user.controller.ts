import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { UserRequest } from '../auth/types/UserRequest';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FollowUserDto } from './dtos/FollowUser.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard)
  getCurrentUser(@Req() request: UserRequest) {
    return request.user;
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile('avatar') avatar: string,
    @Body() body: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, body, avatar);
  }

  @Get(':username')
  getUserByUsername(@Param('username') username: string) {
    return this.userService.getUserByUsername(username);
  }

  @Get('/followers/:id')
  getFollowersByUserId(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getFollowersByUser(id);
  }

  @Get('/followings/:id')
  getFollowingsByUserId(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getFollowingsByUser(id);
  }

  @Post('/follow')
  @UseGuards(AuthGuard)
  followUser(@Req() request: UserRequest, @Body() body: FollowUserDto) {
    return this.userService.followUser(request.user.id, body);
  }

  @Delete('/follow')
  @UseGuards(AuthGuard)
  unfollowUser(@Req() request: UserRequest, @Body() body: FollowUserDto) {
    return this.userService.unfollowUser(request.user.id, body);
  }
}
