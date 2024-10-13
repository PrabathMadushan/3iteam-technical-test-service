import { AppDataSource } from "./data-source";
import { Product } from "./entity/Product";
import { ProductInfo } from "./entity/ProductInfo";
import { faker } from '@faker-js/faker';

const seedProducts = async () => {
    const productRepository = AppDataSource.getRepository(Product);
    const productInfoRepository = AppDataSource.getRepository(ProductInfo);

    for (let i = 0; i < 20; i++) {
        // Create a new product
        const product = new Product();
        product.name = faker.commerce.productName();
        product.created_at = new Date();

        // Save product first to get the generated id
        const savedProduct = await productRepository.save(product);

        // Create product info for the saved product
        const productInfo = new ProductInfo();
        productInfo.product = savedProduct;
        productInfo.description = faker.commerce.productDescription();
        productInfo.price = parseFloat(faker.commerce.price());
        productInfo.category = faker.commerce.department();

        // Save product info
        await productInfoRepository.save(productInfo);
    }
    console.log("Seeding complete: 20 fake products added to the database.");
};

export {seedProducts}