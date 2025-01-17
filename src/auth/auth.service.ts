import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { compare, genSalt, hash } from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { ROLE } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);

    const tokenPair = await this.createTokenPair({
      id: user.id,
      role: user.role,
    });

    return {
      ...tokenPair,
    };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: registerDto.email },
    });

    if (user) {
      throw new BadRequestException("User with this email already exists");
    }

    const salt = await genSalt(10);
    const newUser = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        username: registerDto.username,
        password: await hash(registerDto.password, salt),
      },
    });

    const tokenPair = await this.createTokenPair({
      id: newUser.id,
      role: newUser.role,
    });

    return {
      ...tokenPair,
    };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException("No refresh token provided");
    }

    const result = await this.jwtService.verifyAsync(refreshToken);
    if (!result) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const user = await this.prisma.user.findUnique({
      where: { id: result.id },
    });

    const tokenPair = await this.createTokenPair({
      id: user.id,
      role: user.role,
    });
    return {
      accessToken: tokenPair.accessToken,
      newRefreshToken: tokenPair.refreshToken,
    };
  }

  async createTokenPair(data: { id: string; role: ROLE }) {
    const refreshToken = await this.jwtService.signAsync(data, {
      expiresIn: "7d",
    });

    const accessToken = await this.jwtService.signAsync(data, {
      expiresIn: "15m",
    });

    return { refreshToken, accessToken };
  }

  async validateUser(loginDto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException(
        "User with this email does not exist in this system",
      );
    }

    const isValidPassword = await compare(loginDto.password, user.password);

    if (!isValidPassword) throw new UnauthorizedException("Invalid password");

    return user;
  }
}
