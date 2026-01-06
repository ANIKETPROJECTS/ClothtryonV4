import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.products.list.path, async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  });

  app.get(api.products.getBySku.path, async (req, res) => {
    const product = await storage.getProductBySku(req.params.sku);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  });

  // Seed initial data if empty
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existing = await storage.getProducts();
  if (existing.length === 0) {
    const productsToSeed = [
      {
        name: "ONYU Signature Tee",
        description: "The cornerstone of the ONYU collection. Crafted from 240GSM premium heavyweight cotton, this tee offers a structured yet breathable fit. Features dropped shoulders and a reinforced collar for longevity.",
        price: 2499, // ₹2,499
        sku: "ONYU-TEE-001",
        images: {
          front: "/src/assets/generated_images/signature_onyu_black_t-shirt_front_view_(no_background).png",
          back: "/src/assets/generated_images/signature_onyu_black_t-shirt_back_view_(no_background).png",
          left: "/src/assets/generated_images/signature_onyu_black_t-shirt_left_side_view_(no_background).png",
          right: "/src/assets/generated_images/signature_onyu_black_t-shirt_right_side_view_(no_background).png"
        },
        features: [
          "240GSM Heavyweight Cotton",
          "Oversized Boxy Fit",
          "Reinforced Crew Neck",
          "Eco-friendly Silicon Wash"
        ]
      },
      {
        name: "ONYU Stealth Hoodie",
        description: "Minimalist design meets extreme comfort. Our Stealth Hoodie is made from premium French Terry with a unique water-resistant finish. Perfect for transitional weather.",
        price: 4999, // ₹4,999
        sku: "ONYU-HD-002",
        images: {
          front: "/src/assets/generated_images/premium_black_stealth_hoodie_product_shot.png",
          back: "/src/assets/generated_images/premium_black_hoodie_back_view_(no_background).png",
          left: "/src/assets/generated_images/premium_black_hoodie_left_side_view_(no_background).png",
          right: "/src/assets/generated_images/premium_black_hoodie_right_side_view_(no_background).png"
        },
        features: [
          "400GSM French Terry",
          "Water-resistant Coating",
          "Hidden Tech Pockets",
          "Double-lined Hood"
        ]
      },
      {
        name: "ONYU Cargo Joggers",
        description: "Utility refined. These joggers feature a technical nylon-stretch blend with six functional pockets, designed for the urban explorer who refuses to compromise on style.",
        price: 3999, // ₹3,999
        sku: "ONYU-JG-003",
        images: {
          front: "/src/assets/generated_images/premium_technical_cargo_joggers_product_shot.png",
          back: "/src/assets/generated_images/premium_black_cargo_joggers_back_view_(no_background).png",
          left: "/src/assets/generated_images/premium_black_cargo_joggers_left_side_view_(no_background).png",
          right: "/src/assets/generated_images/premium_black_cargo_joggers_right_side_view_(no_background).png"
        },
        features: [
          "4-Way Stretch Nylon",
          "Articulated Knee Design",
          "Snap-closure Cargo Pockets",
          "Adjustable Tapered Fit"
        ]
      }
    ];

    for (const product of productsToSeed) {
      await storage.createProduct(product);
    }
  }
}
