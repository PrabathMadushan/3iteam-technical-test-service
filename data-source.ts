import "reflect-metadata";
import { DataSource } from "typeorm";
import { Product } from "./entity/Product";
import { ProductInfo } from "./entity/ProductInfo";

// Create DataSource (configuration for TypeORM)
export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root", // Your MySQL username
    password: "1234", // Your MySQL password
    database: "products_db",
    synchronize: true, // Automatically sync schema, good for development
    logging: true,
    entities: [Product, ProductInfo],
});