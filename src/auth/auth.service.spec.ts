import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    };

    it('should successfully register a new user', async () => {
      const createdUser = {
        id: 1,
        name: registerDto.name,
        email: registerDto.email,
        password: 'hashedpassword',
        role: 'user',
      };

      mockUsersService.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
      mockUsersService.create.mockResolvedValue(createdUser);
      mockJwtService.sign.mockReturnValue('jwt_token');

      const result = await service.register(registerDto);

      expect(usersService.findByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(usersService.create).toHaveBeenCalledWith({
        name: registerDto.name,
        email: registerDto.email,
        password: 'hashedpassword',
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 1,
        email: 'john@example.com',
        name: 'John Doe',
        role: 'user',
      });
      expect(result).toEqual({
        access_token: 'jwt_token',
        id: 1,
        username: 'John Doe',
        email: 'john@example.com',
        role: 'user',
      });
    });

    it('should throw BadRequestException if email is already registered', async () => {
      mockUsersService.findByEmail.mockResolvedValue({
        id: 1,
        email: 'john@example.com',
      });

      await expect(service.register(registerDto)).rejects.toThrow(
        new BadRequestException('Email already registered'),
      );
    });

    it('should throw BadRequestException if passwords do not match', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      const invalidDto = {
        ...registerDto,
        confirmPassword: 'differentpassword',
      };

      await expect(service.register(invalidDto)).rejects.toThrow(
        new BadRequestException('Passwords do not match'),
      );
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'john@example.com',
      password: 'password123',
    };

    it('should successfully login and return a token', async () => {
      const user = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedpassword',
        role: 'user',
      };

      mockUsersService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('jwt_token');

      const result = await service.login(loginDto);

      expect(usersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        'hashedpassword',
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 1,
        email: 'john@example.com',
        name: 'John Doe',
        role: 'user',
      });
      expect(result).toEqual({
        access_token: 'jwt_token',
        id: 1,
        username: 'John Doe',
        email: 'john@example.com',
        role: 'user',
      });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const user = {
        id: 1,
        email: 'john@example.com',
        password: 'hashedpassword',
      };

      mockUsersService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
    });
  });
});
