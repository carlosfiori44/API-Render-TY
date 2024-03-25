import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import User from "./user.entity";

@Entity()
export default class Telephone extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    number!: number

    @Column()
    userId!: number

    @ManyToOne(() => User, user => user.telephones)
    user!: User
}