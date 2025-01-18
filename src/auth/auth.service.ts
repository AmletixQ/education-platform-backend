import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { compare, genSalt, hash } from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { ROLE } from "@prisma/client";
import { UserService } from "src/user/user.service";
import { CreateDto } from "src/user/dto/create.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
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

  async register(registerDto: CreateDto) {
    const user = await this.userService.getUserByEmail(registerDto.email);
    if (user) {
      throw new BadRequestException("User with this email already exists");
    }

    const salt = await genSalt(10);
    const newUser = await this.userService.create({
      ...registerDto,
      password: await hash(registerDto.password, salt),
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

    const user = await this.userService.getUserById(result.id);

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
    const user = await this.userService.getUserByEmail(loginDto.email);

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
