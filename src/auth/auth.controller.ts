import { Body, Controller, Post, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { Response } from "express";
import { Cookies } from "./decorators/cookies.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refreshToken, accessToken } =
      await this.authService.login(loginDto);

    response.cookie("refreshToken", refreshToken, {
      httpOnly: true,
    });

    return {
      accessToken,
    };
  }

  @Post("register")
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refreshToken, accessToken } =
      await this.authService.register(registerDto);

    response.cookie("refreshToken", refreshToken, {
      httpOnly: true,
    });

    return {
      accessToken,
    };
  }

  @Post("refresh")
  async refresh(
    @Cookies("refreshToken") refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, newRefreshToken } =
      await this.authService.refresh(refreshToken);

    response.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
    });

    return {
      accessToken,
    };
  }

  @Post("logout")
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie("refreshToken");

    return {
      message: "Logged out",
    };
  }
}
