import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@ValidatorConstraint({ name: 'MatchPasswords' })
class MatchPasswords implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints as string[];
    const relatedValue = (args.object as Record<string, string>)[
      relatedPropertyName
    ];
    return confirmPassword === relatedValue;
  }

  defaultMessage() {
    return 'Passwords do not match';
  }
}

export class RegisterDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'user@email.com' })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  @Validate(MatchPasswords, ['password'])
  confirmPassword: string;
}
