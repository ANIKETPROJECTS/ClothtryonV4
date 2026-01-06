import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { Link } from "wouter";
import editorialImg from "@assets/generated_images/high-end_fashion_editorial_dark_aesthetic.png";
import monochromeImg from "@assets/generated_images/monochrome_fashion_photography_dark_black_grey.png";
import essentialImg from "@assets/generated_images/minimalist_white_premium_t-shirt_editorial.png";
import techImg from "@assets/generated_images/technical_apparel_detail_dark_aesthetic.png";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const collections = [
  {
    id: "essential",
    title: "The Essential Series",
    subtitle: "Foundation of Modern Style",
    desc: "A curation of timeless silhouettes crafted from 240GSM premium cotton. Designed for those who value structure and breathability in their daily rotation.",
    image: essentialImg
  },
  {
    id: "tech",
    title: "Technical Refinement",
    subtitle: "Utility Meets Luxury",
    desc: "Merging water-resistant technical fabrics with architectural draping. This collection explores the intersection of performance and high-end aesthetics.",
    image: techImg
  },
  {
    id: "monochrome",
    title: "Monochrome Studio",
    subtitle: "The Power of One",
    desc: "An exploration of depth and texture through a singular palette. Deep blacks, charcoal greys, and stark whites defined by premium French Terry.",
    image: monochromeImg
  }
];

export default function Collections() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <img src={editorialImg} alt="Editorial" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-20 text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-bold text-white mb-4"
          >
            Curated <span className="text-primary">Visions</span>
          </motion.h1>
          <p className="text-neutral-300 text-lg max-w-xl mx-auto">Explore our seasonal narratives and architectural garment studies.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-32">
        {collections.map((item, idx) => (
          <motion.section 
            key={item.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}
          >
            <div className="flex-1 space-y-6">
              <span className="text-primary font-mono text-sm tracking-[0.3em] uppercase">{item.subtitle}</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">{item.title}</h2>
              <p className="text-neutral-400 text-lg leading-relaxed">{item.desc}</p>
              <Link href="/shop" className="inline-block border-b-2 border-primary pb-1 text-white font-bold tracking-wider hover:text-primary transition-colors">
                VIEW LOOKBOOK
              </Link>
            </div>
            <div className="flex-1 w-full aspect-[4/5] bg-neutral-900 overflow-hidden rounded-sm group">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              />
            </div>
          </motion.section>
        ))}
      </div>

      <footer className="bg-background border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xl font-display font-bold tracking-tighter text-white">
            ONYU<span className="text-primary">.</span>
          </span>
          <p className="text-sm text-neutral-600 mt-4">© 2025 ONYU Digital Fashion.</p>
        </div>
      </footer>
    </div>
  );
}
