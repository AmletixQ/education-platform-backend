import { IsNotEmpty, IsString } from "class-validator";

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export type UpdateCourseDto = Partial<CreateCourseDto>;
