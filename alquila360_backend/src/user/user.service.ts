import { Injectable } from "@nestjs/common";
import AppDataSource from "src/data-source";
import { User } from "src/entity/user.entity";

@Injectable()
export class UserService {
    async createUser(user: User) { 
        return await AppDataSource.getRepository(User).save(user);
    }

    async getAllUsers(){
        return await AppDataSource.getRepository(User).find();
    }

    async getUserById(ci: number) {
        return await AppDataSource.getRepository(User).findOneBy({ ci });
    }

    async updateUser(ci: number, userData: Partial<User>) {
        await AppDataSource.getRepository(User).update(ci, userData);
        return this.getUserById(ci);
    }

    async deleteUser(id: number) {
        return await AppDataSource.getRepository(User).delete(id);
    }
}