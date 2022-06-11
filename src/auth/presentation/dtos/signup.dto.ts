import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty({ message: 'error.validation_message.invalid_username' })
  @MinLength(8, { message: 'error.validation_message.min_length.username.3' })
  username: string;

  @IsEmail({}, { message: 'error.validation_message.invalid_email' })
  email: string;

  @IsNotEmpty({ message: 'error.validation_message.invalid_password' })
  @MinLength(8, { message: 'error.validation_message.min_length.password.6' })
  password: string;
}
