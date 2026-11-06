import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import {
  ApiStandardResponse,
  ApiValidationErrorResponse,
  ApiNotFoundResponse,
  ApiAuthUnauthorizedResponse,
  ApiForbiddenAccessResponse,
} from '../common/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin')
  @ApiOperation({
    summary: 'Listar todos os usuários (Admin)',
    description:
      'Retorna a lista de todos os usuários registrados no sistema. Exige permissão de administrador.',
  })
  @ApiStandardResponse({
    type: UserResponseDto,
    dataKey: 'users',
    isArray: true,
    description: 'Lista de usuários retornada com sucesso.',
  })
  @ApiAuthUnauthorizedResponse()
  @ApiForbiddenAccessResponse()
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
  @ApiOperation({
    summary: 'Alterar permissão de um usuário (Admin)',
    description:
      'Atualiza o papel (role) de um usuário específico para `user` ou `admin`. Exige permissão de administrador.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'ID numérico do usuário',
  })
  @ApiStandardResponse({
    type: UserResponseDto,
    dataKey: 'user',
    description: 'Permissão do usuário alterada com sucesso.',
  })
  @ApiNotFoundResponse('Usuário não encontrado.')
  @ApiValidationErrorResponse('Valor de role inválido.')
  @ApiAuthUnauthorizedResponse()
  @ApiForbiddenAccessResponse()
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
  @ApiOperation({
    summary: 'Consultar perfil do usuário autenticado',
    description:
      'Retorna os dados cadastrais da conta do usuário atualmente autenticado.',
  })
  @ApiStandardResponse({
    type: UserResponseDto,
    dataKey: 'user',
    description: 'Perfil do usuário retornado com sucesso.',
  })
  @ApiAuthUnauthorizedResponse()
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
  @ApiOperation({
    summary: 'Atualizar perfil do usuário autenticado',
    description:
      'Permite ao usuário conectado atualizar seu nome, e-mail e alterar sua senha fornecendo a senha atual.',
  })
  @ApiStandardResponse({
    type: UserResponseDto,
    dataKey: 'user',
    description: 'Perfil atualizado com sucesso.',
  })
  @ApiValidationErrorResponse('Dados inválidos ou senha atual incorreta.')
  @ApiAuthUnauthorizedResponse()
  async updateProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
    const result = await this.usersService.updateProfile(req.user.id, dto);
    return {
      success: true,
      user: result,
      message: 'Profile updated successfully',
    };
  }
}
