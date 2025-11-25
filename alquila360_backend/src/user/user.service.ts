import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { User } from "src/entity/user.entity";
import { Role } from "src/entity/rol.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async create(dto: any) {
    // dto.roles viene como [1, 2, 3] etc.
    let roles: Role[] = [];

    if (Array.isArray(dto.roles) && dto.roles.length > 0) {
      roles = await this.roleRepo.find({
        where: { idRol: In(dto.roles) },
      });
    }

    const user = this.userRepo.create({
      ci: dto.ci,
      name: dto.name,
      contrasena: dto.contrasena,               // ← usa "contrasena" del body
      fechaNacimiento: dto.fechaNacimiento ?? null,
      activacion: true,
      roles,
    });

    return this.userRepo.save(user);
  }

  async getAllUsers() {
    return this.userRepo.find({ relations: ["roles"] });
  }

  async getUserById(ci: number) {
    return this.userRepo.findOne({
      where: { ci },
      relations: ["roles"],
    });
  }

  async updateUser(ci: number, userData: Partial<User>) {
    await this.userRepo.update(ci, userData);
    return this.getUserById(ci);
  }

  async deleteUser(ci: number) {
    return this.userRepo.delete(ci);
  }
}
