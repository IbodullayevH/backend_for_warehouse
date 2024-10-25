import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('Products')
export class Product {

    @PrimaryGeneratedColumn({ type: "int" })
    id: number;

    @Column({ unique: true, nullable: true, type: "varchar", length: 255 })
    name: string;

    @Column({ nullable: true, type: "text" })
    image: string;

    @Column({ nullable: true, type: "bigint" })
    price: number;

    @Column({ nullable: true, type: "varchar", length: 255 })
    category: string;

    @Column({ nullable: true, type: "int" })
    count: number;

    @Column({ nullable: true, type: "int" })
    hajim: number;

    @CreateDateColumn({ type: "timestamp" })
    created_at: Date

    @UpdateDateColumn({ type: "timestamp" })
    updated_at: Date
}

