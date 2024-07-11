import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/decorators/user.decorator';
import { Prisma, User } from '@prisma/client';
import { UserResponseDTO } from './dto/user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('/')
    @UseGuards(AuthGuard('access'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user information' })
    @ApiOkResponse({ description: 'User information', type: UserResponseDTO })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async getUser(@Req() req: any) {
        return await this.userService.findUserById(req.user.id);
    }

    @Patch('/')
    @UseGuards(AuthGuard('access'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update user information' })
    @ApiOkResponse({
        description: 'User information updated',
        type: UserResponseDTO,
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async updateUser(@CurrentUser() user: User, @Body() data: Prisma.UserUpdateInput) {
        return await this.userService.updateUserById(user.id, data);
    }

    @Post('/profile-image')
    @UseGuards(AuthGuard('access'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update user profile image' })
    @ApiOkResponse({ description: 'User profile image updated' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async updateUserProfileImage(@CurrentUser() user: User, @Body() base64ProfileImage: string) {
        return await this.userService.updateUserProfileImageById(user.id, base64ProfileImage);
    }
}
