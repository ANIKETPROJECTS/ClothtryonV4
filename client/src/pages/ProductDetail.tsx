import { useState } from "react";
import { useParams, useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Star, Share2, Heart, Scan, Check } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { VirtualTryOn } from "@/components/VirtualTryOn";
import { useProduct } from "@/hooks/use-products";
import { TSHIRT_CONFIG } from "@/lib/tshirt-config";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  images: {
    front: string;
    back: string;
    left: string;
    right: string;
    [key: string]: string;
  };
  sizes: string[];
  features: string[];
}

export default function ProductDetail() {
  const { id } = useParams();
  const [isVTOOpen, setIsVTOOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  // Use the actual product data from the hook
  const { data: fetchedProduct } = useProduct(Number(id));
  
  const product = (fetchedProduct as any) || {
    id: 1,
    name: TSHIRT_CONFIG.name,
    price: TSHIRT_CONFIG.price,
    description: "Crafted from heavy-weight 280gsm cotton jersey, this oversized tee features dropped shoulders and a boxy fit. The gold foil branding adds a touch of understated luxury.",
    images: {
      front: TSHIRT_CONFIG.images.front,
      back: TSHIRT_CONFIG.images.back,
      left: TSHIRT_CONFIG.images.left,
      right: TSHIRT_CONFIG.images.right,
    },
    sizes: ["XS", "S", "M", "L", "XL"],
    features: ["100% Organic Cotton", "Heavyweight 280gsm", "Boxy Fit", "Made in Portugal"]
  };

  const images = [
    product.images?.front,
    product.images?.back,
    product.images?.left,
    product.images?.right
  ].filter(Boolean) as string[];

  const getViewLabel = (idx: number) => {
    const labels = ["Front View", "Back View", "Left Side", "Right Side"];
    return labels[idx] || `View ${idx + 1}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* VTO Modal */}
      <AnimatePresence>
        {isVTOOpen && (
          <VirtualTryOn 
            onClose={() => setIsVTOOpen(false)} 
            productImage={images[0] || ""}
          />
        )}
      </AnimatePresence>

      <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24">
          
          {/* Image Gallery */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-[3/4] bg-neutral-900 rounded-lg overflow-hidden relative group"
            >
              {images[activeImage] && (
                <img 
                  src={images[activeImage]} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Floating VTO Trigger */}
              <button
                onClick={() => setIsVTOOpen(true)}
                className="absolute bottom-6 right-6 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-black px-6 py-3 rounded-full flex items-center gap-2 transition-all group-hover:scale-105 shadow-xl"
              >
                <Scan className="w-5 h-5 text-black" />
                <span className="font-bold">Virtual Try-On</span>
              </button>
            </motion.div>

            <div className="grid grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-square rounded-md overflow-hidden border-2 transition-all flex flex-col items-center ${
                    activeImage === idx ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={getViewLabel(idx)} className="w-full h-full object-cover" />
                  <span className="text-[10px] uppercase mt-1 text-neutral-500 font-bold">{getViewLabel(idx)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <div className="flex justify-between items-start mb-4">
                <span className="text-primary font-bold tracking-widest text-sm uppercase">New Collection</span>
                <div className="flex gap-4">
                  <button className="text-neutral-400 hover:text-white transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="text-neutral-400 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-light text-white">
                  {formatPrice(product.price)}
                </span>
                <div className="flex items-center text-yellow-500 text-sm">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-neutral-500 ml-2">(12 reviews)</span>
                </div>
              </div>

              <p className="text-neutral-400 leading-relaxed mb-8 text-lg">
                {product.description}
              </p>

              {/* Size Selector */}
              <div className="mb-8">
                <div className="flex justify-between mb-4">
                  <span className="text-sm font-bold text-white uppercase">Select Size</span>
                  <button className="text-sm text-neutral-400 underline hover:text-white">Size Guide</button>
                </div>
                <div className="flex gap-3">
                  {(product.sizes as string[])?.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-lg border flex items-center justify-center font-bold transition-all ${
                        selectedSize === size
                          ? "bg-white text-black border-white"
                          : "border-neutral-700 text-neutral-400 hover:border-neutral-500"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mb-10">
                <button className="flex-1 bg-primary hover:bg-primary/90 text-black font-bold py-4 rounded-full flex items-center justify-center gap-2 transition-colors">
                  <ShoppingBag className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>

              {/* Features List */}
              <div className="border-t border-white/10 pt-8">
                <h3 className="text-sm font-bold text-white uppercase mb-4">Highlights</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(product.features as string[])?.map((feature, i) => (
                    <li key={i} className="flex items-center text-neutral-400 text-sm">
                      <Check className="w-4 h-4 text-primary mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
