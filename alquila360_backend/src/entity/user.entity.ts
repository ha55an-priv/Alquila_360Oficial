import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Property } from '../property/property.entity';

import { OneToMany } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @OneToMany(() => Property, property => property.owner)
    properties: Property[];
    
}