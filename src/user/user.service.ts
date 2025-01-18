/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma.service";
import { UpdateDto } from "./dto/update.dto";
import { CreateDto } from "./dto/create.dto";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDto) {
    return await this.prisma.user.create({ data: dto });
  }

  async getAllUsers() {
    return (await this.prisma.user.findMany()).map((user) =>
      this.returnUserFields(user),
    );
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException("User doesn't exist in system!");
    }

    return this.returnUserFields(user);
  }

  async update(userId: string, dto: UpdateDto) {
    return this.returnUserFields(
      await this.prisma.user.update({ where: { id: userId }, data: dto }),
    );
  }

  async userDelete(userId: string) {
    return this.returnUserFields(
      await this.prisma.user.delete({ where: { id: userId } }),
    );
  }

  async getUserById(userId: string) {
    return await this.prisma.user.findUnique({ where: { id: userId } });
  }

  async getUserByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  returnUserFields(user: User) {
    const { password, ...fields } = user;

    return fields;
  }
}
