import { Body, Controller, Delete, Get, Patch, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { Auth } from "src/auth/decorators/auth.decorator";
import { UserId } from "./decorators/userId.decorator";
import { UpdateDto } from "./dto/update.dto";
import { CreateDto } from "./dto/create.dto";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createDto: CreateDto) {
    return this.userService.create(createDto);
  }

  @Auth("admin")
  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Auth()
  @Get("profile")
  getProfile(@UserId() id: string) {
    return this.userService.getProfile(id);
  }

  @Auth()
  @Patch("update")
  update(@UserId() id: string, @Body() updateDto: UpdateDto) {
    return this.userService.update(id, updateDto);
  }

  @Auth()
  @Delete("delete")
  userDelete(@UserId() id: string) {
    return this.userService.userDelete(id);
  }
}
