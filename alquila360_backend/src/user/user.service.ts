import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
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
    // buscar el rol (ej. dto.rol = 1)
    const role = await this.roleRepo.findOne({
      where: { idRol: dto.rol },
    });

    // opcional: validar
    // if (!role) throw new NotFoundException('Rol no encontrado');

    const user = this.userRepo.create({
      ci: dto.ci,
      name: dto.name,
      contrasena: dto.password,
      fechaNacimiento: dto.fechaNacimiento ?? null,
      activacion: true,
      roles: role ? [role] : [],
    } as any); // cast para que TS no se queje por roles

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
