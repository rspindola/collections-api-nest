import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should login a user and return the result', async () => {
      const dto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const serviceResult = {
        access_token: 'token',
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
      };
      mockAuthService.login.mockResolvedValue(serviceResult);

      const result = await controller.login(dto);

      expect(result).toEqual({
        success: true,
        user: serviceResult,
        message: 'User signed in',
      });
      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
    });
  });

  describe('register', () => {
    it('should register a user and return the result', async () => {
      const dto: RegisterDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };
      const serviceResult = {
        access_token: 'token',
        id: 1,
        username: 'Test User',
        email: 'test@example.com',
        role: 'user',
      };
      mockAuthService.register.mockResolvedValue(serviceResult);

      const result = await controller.register(dto);

      expect(result).toEqual({
        success: true,
        user: serviceResult,
        message: 'User created successfully.',
      });
      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('logout', () => {
    it('should return a logout success response', () => {
      const result = controller.logout();
      expect(result).toEqual({
        success: true,
        message: 'User logged out successfully',
      });
    });
  });
});
