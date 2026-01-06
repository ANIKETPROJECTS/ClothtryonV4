import { motion } from "framer-motion";
import { Link } from "wouter";
import type { Product } from "@shared/schema";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  // Use typed product images object
  const images = product.images as { front: string; back: string };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative"
    >
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-white rounded-sm">
          {/* Main Image */}
          <img
            src={images.front || "https://placehold.co/600x800/1a1a1a/gold?text=Product"}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-white font-medium text-sm tracking-widest uppercase border border-white/30 px-6 py-2 backdrop-blur-sm">
              View Details
            </span>
          </div>
          
          {/* Badge */}
          <div className="absolute top-4 left-4">
            <span className="bg-primary text-black text-xs font-bold px-2 py-1 uppercase tracking-wider">
              New Arrival
            </span>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-start">
          <div>
            <h3 className="text-lg font-display font-medium text-white group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="mt-1 text-sm text-neutral-400">
              {product.sku}
            </p>
          </div>
          <p className="text-lg font-medium text-white">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
