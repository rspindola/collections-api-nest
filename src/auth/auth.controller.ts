import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthUserDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import {
  ApiStandardResponse,
  ApiValidationErrorResponse,
  ApiAuthUnauthorizedResponse,
  ErrorResponseDto,
} from '../common/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Autenticação de usuário (Login)',
    description:
      'Valida as credenciais (e-mail e senha) e retorna os dados do usuário com o token JWT de acesso.',
  })
  @ApiStandardResponse({
    type: AuthUserDto,
    status: HttpStatus.OK,
    description: 'Autenticação realizada com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Credenciais inválidas (e-mail ou senha incorretos).',
    type: ErrorResponseDto,
  })
  @ApiValidationErrorResponse('Dados de login em formato inválido.')
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto);
    return {
      success: true,
      data: result,
      user: result,
      message: 'User signed in',
    };
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Cadastro de novo usuário (Registro)',
    description:
      'Cria uma nova conta de usuário comum no sistema e já retorna a sessão autenticada com token JWT.',
  })
  @ApiStandardResponse({
    type: AuthUserDto,
    status: HttpStatus.CREATED,
    description: 'Usuário registrado e autenticado com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'E-mail já registrado ou confirmação de senha divergente.',
    type: ErrorResponseDto,
  })
  @ApiValidationErrorResponse('Falha nas regras de validação dos campos.')
  async register(@Body() dto: RegisterDto) {
    const result = await this.authService.register(dto);
    return {
      success: true,
      data: result,
      user: result,
      message: 'User created successfully.',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Encerramento de sessão (Logout)',
    description:
      'Emite resposta de encerramento da sessão atual autenticada pelo token JWT.',
  })
  @ApiStandardResponse({
    status: HttpStatus.OK,
    description: 'Sessão encerrada com sucesso.',
  })
  @ApiAuthUnauthorizedResponse()
  logout() {
    return {
      success: true,
      message: 'User logged out successfully',
    };
  }
}
