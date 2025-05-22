import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateGoogleUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  picture: string | null;
}
