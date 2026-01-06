import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Star, ShoppingBag, Truck, ShieldCheck, Scan } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/use-products";
import type { Product } from "@shared/schema";

// Helper for animations
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function Home() {
  const { data: products, isLoading } = useProducts();
  const featuredProducts = products?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video/Image Mockup */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
          {/* Using unsplash with description comment */}
          {/* Fashion model dark luxury studio */}
          <img 
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2576&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-60"
          />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial="initial"
            animate="animate"
            variants={{
              initial: { opacity: 0 },
              animate: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="max-w-3xl"
          >
            <motion.span variants={fadeInUp} className="inline-block text-primary font-bold tracking-widest uppercase text-sm mb-4 border border-primary/30 px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full">
              Fall / Winter 2025
            </motion.span>
            
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-6 leading-tight">
              Redefining <br/>
              <span className="text-gradient">Digital Luxury</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-neutral-300 mb-8 max-w-xl leading-relaxed">
              Experience the future of fashion with our AI-powered Virtual Try-On technology. 
              Premium materials meet cutting-edge innovation.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop" className="group inline-flex items-center justify-center px-8 py-4 bg-white text-black font-bold text-lg rounded-full hover:bg-neutral-200 transition-colors">
                Shop Collection
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button onClick={() => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center justify-center px-8 py-4 border border-white/30 text-white font-bold text-lg rounded-full hover:bg-white/10 transition-colors backdrop-blur-sm">
                View Lookbook
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Banner */}
      <div className="bg-neutral-900 border-y border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureItem 
              icon={<Star className="w-6 h-6 text-primary" />}
              title="Premium Quality"
              desc="Sourced from the finest Italian mills"
            />
            <FeatureItem 
              icon={<ShoppingBag className="w-6 h-6 text-primary" />}
              title="Virtual Fitting"
              desc="AI-powered size recommendations"
            />
            <FeatureItem 
              icon={<Truck className="w-6 h-6 text-primary" />}
              title="Global Shipping"
              desc="Express delivery worldwide"
            />
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <section id="featured" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
                Featured Collection
              </h2>
              <p className="text-neutral-400">Curated pieces for the modern aesthetic</p>
            </div>
            <Link href="/shop" className="hidden md:flex items-center text-primary hover:text-primary/80 transition-colors font-medium">
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="aspect-[3/4] bg-neutral-900 animate-pulse rounded-sm" />
              ))
            ) : (
              featuredProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))
            )}
          </div>
          
          <div className="mt-12 text-center md:hidden">
            <Link href="/shop" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors font-medium">
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* VTO Promo Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-neutral-900" />
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-mono text-sm uppercase tracking-widest mb-4 block">Beta Feature</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                Try Before You Buy. <br/>
                <span className="text-white/50">Instantly.</span>
              </h2>
              <p className="text-lg text-neutral-400 mb-8 leading-relaxed">
                Our proprietary AI tracking technology maps garments to your body in real-time. 
                No uploads required. Just you and the camera.
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-white">
                  <ShieldCheck className="w-5 h-5 text-primary mr-3" />
                  <span>Privacy-first: Images processed locally</span>
                </li>
                <li className="flex items-center text-white">
                  <ShieldCheck className="w-5 h-5 text-primary mr-3" />
                  <span>Accurate sizing visualization</span>
                </li>
              </ul>

              <Link href="/product/1" className="inline-flex px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-colors">
                Try Demo Now
              </Link>
            </div>
            
            <div className="relative">
               {/* UI Mockup for VTO */}
               <div className="aspect-[4/3] bg-black rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative group">
                 <div className="absolute inset-0 flex items-center justify-center">
                   {/* Abstract representation of scanning */}
                   <div className="w-32 h-32 border-2 border-primary/50 rounded-full animate-ping absolute"></div>
                   <div className="w-24 h-24 border-2 border-primary rounded-full absolute"></div>
                   <Scan className="w-12 h-12 text-white animate-pulse relative z-10" />
                 </div>
                 <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                   <div className="flex justify-between items-end">
                     <div className="space-y-1">
                        <div className="h-2 w-24 bg-white/20 rounded"></div>
                        <div className="h-2 w-16 bg-white/20 rounded"></div>
                     </div>
                     <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                       <div className="h-3 w-3 rounded-full bg-primary"></div>
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <span className="text-xl font-display font-bold tracking-tighter text-white">
              ONYU<span className="text-primary">.</span>
            </span>
            <div className="flex space-x-6 text-sm text-neutral-500">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-sm text-neutral-600">© 2025 ONYU Digital Fashion.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex items-start p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
      <div className="p-2 bg-white/5 rounded-lg mr-4 text-primary">
        {icon}
      </div>
      <div>
        <h3 className="font-display font-bold text-white text-lg">{title}</h3>
        <p className="text-sm text-neutral-400 mt-1">{desc}</p>
      </div>
    </div>
  );
}
