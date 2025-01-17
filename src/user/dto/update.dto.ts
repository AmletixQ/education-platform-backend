import { IsEmail, IsString, MinLength } from "class-validator";

export class UpdateDto {
  @IsEmail()
  email?: string;

  @IsString()
  username: string;

  @IsString()
  @MinLength(8)
  password?: string;
}
