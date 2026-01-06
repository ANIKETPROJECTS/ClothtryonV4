import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/use-products";
import { Filter, ChevronDown } from "lucide-react";

export default function Shop() {
  const { data: products, isLoading } = useProducts();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <div className="pt-24 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">All Products</h1>
            <p className="text-neutral-400">Discover our latest collection</p>
          </div>
          
          <div className="flex gap-4 mt-4 md:mt-0">
            <button className="flex items-center space-x-2 text-sm font-medium text-white px-4 py-2 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <button className="flex items-center space-x-2 text-sm font-medium text-white px-4 py-2 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
              <span>Sort by: Featured</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {isLoading ? (
            Array(8).fill(0).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[3/4] bg-neutral-900 rounded-sm animate-pulse" />
                <div className="h-4 bg-neutral-900 w-2/3 animate-pulse rounded" />
                <div className="h-4 bg-neutral-900 w-1/4 animate-pulse rounded" />
              </div>
            ))
          ) : (
            products?.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))
          )}
        </div>
        
        {!isLoading && (!products || products.length === 0) && (
          <div className="text-center py-24">
             <p className="text-neutral-500">No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
