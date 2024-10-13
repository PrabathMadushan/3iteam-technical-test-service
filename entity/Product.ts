import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne } from "typeorm";
import { ProductInfo } from "./ProductInfo";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @CreateDateColumn()
    created_at: Date;

    @OneToOne(() => ProductInfo, (productInfo) => productInfo.product, { cascade: true })
    productInfo: ProductInfo;
}
