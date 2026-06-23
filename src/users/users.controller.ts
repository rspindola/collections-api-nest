import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'List all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of users returned.' })
  async index() {
    const result = await this.usersService.findAll();
    return {
      success: true,
      users: result,
      message: 'Successfully listed users',
    };
  }

  @Put(':id/role')
  @Roles('admin')
  @ApiOperation({ summary: 'Update user role (Admin only)' })
  @ApiResponse({ status: 200, description: 'User role updated successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    const result = await this.usersService.updateRole(+id, dto.role);
    return {
      success: true,
      user: {
        id: result.id,
        name: result.name,
        email: result.email,
        role: result.role,
      },
      message: 'User role updated successfully',
    };
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile returned.' })
  async profile(@Request() req: any) {
    const user = await this.usersService.findById(req.user.id);
    // Remove password
    delete (user as any).password;
    return {
      success: true,
      user,
      message: 'Successfully fetched profile',
    };
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async updateProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
    const result = await this.usersService.updateProfile(req.user.id, dto);
    return {
      success: true,
      user: result,
      message: 'Profile updated successfully',
    };
  }
}
