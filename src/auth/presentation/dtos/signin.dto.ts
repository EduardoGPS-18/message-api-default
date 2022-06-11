import { IsEmail, IsNotEmpty } from 'class-validator';

export class SigninDto {
  @IsEmail({}, { message: 'error.validation_message.invalid_email' })
  email: string;

  @IsNotEmpty({ message: 'error.validation_message.invalid_password' })
  password: string;
}
