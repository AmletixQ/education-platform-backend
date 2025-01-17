import { ROLE } from "@prisma/client";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @MinLength(6)
  @IsString()
  password: string;

  @IsString()
  @IsNotEmpty()
  role: ROLE;
}
