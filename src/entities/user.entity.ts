import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

@Entity('Users')
export class User {

    @PrimaryGeneratedColumn({ type: "int" })
    id: number;

    @Column({ unique: true, type: "text" })
    login: string;

    @Column({ nullable: true, type: "varchar", length: "80" })
    password: string;

    @Column({ nullable: true, type: "text" })
    address: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER
    })
    role: UserRole;
}
