import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { ShieldCheck, Zap, Globe, Users } from "lucide-react";
import { Link } from "wouter";

import sustainableStudioImg from "@assets/generated_images/sustainable_fashion_studio_background_black.png";
import luxuryFabricImg from "@assets/generated_images/luxury_fabric_texture_background_dark.png";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

function TimelineItem({ year, title, desc, side }: { year: string, title: string, desc: string, side: 'left' | 'right' }) {
  return (
    <div className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}>
      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-neutral-800 bg-background text-primary font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
        {year.slice(-2)}
      </div>
      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-xl border border-white/5 bg-neutral-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between space-x-2 mb-1">
          <div className="font-bold text-white text-xl">{title}</div>
          <time className="font-mono text-sm text-primary">{year}</time>
        </div>
        <div className="text-neutral-400">{desc}</div>
      </div>
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

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial="initial"
          animate="animate"
          className="max-w-3xl mb-16"
        >
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-display font-bold text-white mb-8">
            The Future of <br/>
            <span className="text-primary">Digital Identity</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl text-neutral-400 leading-relaxed mb-8">
            ONYU is not just a brand; it's a digital-first fashion ecosystem. We bridge the gap between high-end apparel and cutting-edge technology to create a seamless, personalized experience for the modern individual.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="aspect-square bg-neutral-900 rounded-2xl overflow-hidden"
          >
            <img 
              src={sustainableStudioImg} 
              alt="Our Process" 
              className="w-full h-full object-cover opacity-80"
            />
          </motion.div>
          
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-display font-bold text-white mb-4">Our Vision</h2>
              <p className="text-neutral-400 leading-relaxed">
                We believe that fashion should be as dynamic as the world we live in. By leveraging AI and real-time pose tracking, we empower our customers to express themselves with confidence, ensuring a perfect fit and style before the garment even leaves our workshop.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="p-3 bg-primary/10 rounded-lg w-fit">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-white">Privacy First</h3>
                <p className="text-sm text-neutral-500">Local processing ensures your data never leaves your device.</p>
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-primary/10 rounded-lg w-fit">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-white">Innovation</h3>
                <p className="text-sm text-neutral-500">Proprietary AI models built specifically for garment draping.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <section className="mb-32">
          <h2 className="text-4xl font-display font-bold text-white mb-16 text-center">The Journey</h2>
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-800 before:to-transparent">
            <TimelineItem year="2023" title="Foundation" desc="ONYU was born from a desire to merge luxury apparel with digital innovation." side="left" />
            <TimelineItem year="2024" title="VTO V1.0" desc="Launched our proprietary real-time pose tracking engine." side="right" />
            <TimelineItem year="2025" title="The Future" desc="Scaling our sustainable production and refined garment studies." side="left" />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-32">
          <h2 className="text-4xl font-display font-bold text-white mb-12 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-neutral-900 p-6 rounded-xl border border-white/5">
              <h3 className="text-white font-bold mb-2">How accurate is the Virtual Try-On?</h3>
              <p className="text-neutral-400 text-sm">Our AI tracking technology maps garments with over 95% accuracy to your body proportions in real-time.</p>
            </div>
            <div className="bg-neutral-900 p-6 rounded-xl border border-white/5">
              <h3 className="text-white font-bold mb-2">Is my camera feed private?</h3>
              <p className="text-neutral-400 text-sm">Yes. All pose detection processing happens locally on your device. We never store or upload your video feed.</p>
            </div>
            <div className="bg-neutral-900 p-6 rounded-xl border border-white/5">
              <h3 className="text-white font-bold mb-2">What is the delivery time?</h3>
              <p className="text-neutral-400 text-sm">We offer express shipping across India, typically delivering within 3-5 business days.</p>
            </div>
            <div className="bg-neutral-900 p-6 rounded-xl border border-white/5">
              <h3 className="text-white font-bold mb-2">What is your return policy?</h3>
              <p className="text-neutral-400 text-sm">We offer a 7-day no-questions-asked return policy for all unworn items in original packaging.</p>
            </div>
          </div>
        </section>

        <section className="bg-neutral-900 rounded-3xl p-8 md:p-16 text-center border border-white/5">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-8">Ready to define your look?</h2>
            <Link href="/shop" className="inline-flex px-12 py-4 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-colors">
              Enter The Shop
            </Link>
          </motion.div>
        </section>
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
