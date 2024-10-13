import express from "express";
import { AppDataSource } from "./data-source";
import { Product } from "./entity/Product";
import { ProductInfo } from "./entity/ProductInfo";
import bodyParser from "body-parser";
import { seedProducts } from "./seed";
import cors from "cors"; // Import CORS

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // The front-end URL
  })
);

app.use(bodyParser.json());

// Initialize TypeORM
AppDataSource.initialize()
  .then(() => {
    seedProducts();
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

// Create a new product
app.post("/products", async (req, res) => {
  const { name, description, price, category } = req.body;

  try {
    const product = new Product();
    product.name = name;

    const productInfo = new ProductInfo();
    productInfo.description = description;
    productInfo.price = price;
    productInfo.category = category;

    product.productInfo = productInfo;

    await AppDataSource.manager.save(product);
    res.status(201).send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get all products
app.get("/products", async (req, res) => {
  try {
    const products = await AppDataSource.getRepository(Product)
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.productInfo", "productInfo")
      .getMany();
    res.send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a product by ID
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const product = await AppDataSource.getRepository(Product)
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.productInfo", "productInfo")
      .where("product.id = :id", { id })
      .getOne();
    if (!product) {
      res.status(404).send({ message: "Product not found" });
    }
    // res.send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a product
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category } = req.body;

  try {
    const productRepository = AppDataSource.getRepository(Product);
    const product = await productRepository.findOneBy({ id: Number(id) });
    if (!product) {
      res.status(404).send({ message: "Product not found" });
    } else {
      product.name = name;

      const productInfo = product.productInfo;
      productInfo.description = description;
      productInfo.price = price;
      productInfo.category = category;

      await productRepository.save(product);
      res.send(product);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete a product
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const productRepository = AppDataSource.getRepository(Product);
    const productInfoRepository = AppDataSource.getRepository(ProductInfo);
    const product = await productRepository.findOneBy({ id: Number(id) });
    if (!product) {
      res.status(404).send({ message: "Product not found" });
    } else {
      await productInfoRepository.delete({ product: { id: Number(id) } });
      await productRepository.remove(product);
    }
    res.send({ message: "Product deleted" });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Start the server
app.listen(3001, () => {
  console.log("Server running on port 3000");
});
