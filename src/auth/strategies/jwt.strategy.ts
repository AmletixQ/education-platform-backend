import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    // private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: true,
      secretOrKey: configService.get("JWT_SECRET"),
    });
  }

  // static extractJwt(req: Request) {
  //   if (
  //     req.cookies &&
  //     req.cookies["refreshToken"] &&
  //     req.cookies["refreshToken"].length > 0
  //   )
  //     return req.cookies["refreshToken"];

  //   return null;
  // }

  async validate(id: string) {
    return id;
  }
}
