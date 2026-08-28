import bookDiaspora from '@/assets/book-diaspora.jpg';
import { useLanguage } from '@/i18n/LanguageContext';
import { motion } from 'framer-motion';
import { ShoppingBag, Star } from 'lucide-react';

export function FeaturedBook() {
  const { t } = useLanguage();

  return (
    <section id="obras" className="relative py-32 bg-white overflow-hidden">
      {/* Premium Background Glow (Light Mode) */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center">
          
          {/* Left Side: Large Book Cover with 3D feel */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }} 
            whileInView={{ opacity: 1, scale: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            className="w-full lg:w-1/2 relative flex justify-center"
          >
            <div className="relative group perspective-[1000px]">
              {/* Glow behind book */}
              <div className="absolute -inset-8 bg-gradient-to-r from-primary/10 to-orange-500/10 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700 -z-10 rounded-full" />
              <img 
                src={bookDiaspora} 
                alt="Diáspora" 
                className="w-full max-w-md h-auto rounded shadow-2xl shadow-black/20 group-hover:-translate-y-4 group-hover:scale-[1.02] group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] transition-all duration-700" 
              />
            </div>
          </motion.div>

          {/* Right Side: Content */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2"
          >
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary text-primary-foreground mb-3 text-xs font-medium tracking-widest uppercase shadow-sm">
              <span> {t.featured.badge}</span>
            </div>
            
            <h2 className="font-display text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 tracking-tight mb-4">
              {t.featured.title}
            </h2>
            <p className="text-2xl text-primary font-display italic mb-4">
              {t.featured.subtitle}
            </p>

            <p className="text-foreground/80 leading-relaxed mb-12 text-lg font-light">
              {t.featured.description}
            </p>

            {/* Language Editions - Premium Cards */}
            <div className="space-y-6">
              <h3 className="text-xs tracking-widest uppercase text-muted-foreground font-medium mb-4">
                Ediciones Disponibles
              </h3>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Spanish Option */}
                <a 
                  href="https://amazon.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group relative overflow-hidden rounded-2xl border border-border bg-white p-6 hover:border-primary/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 flex flex-col h-full">
                    <h4 className="font-display text-2xl text-foreground mb-2">{t.featured.spanishVersion}</h4>
                    <div className="flex gap-1 mb-8">
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-primary text-primary" />)}
                    </div>
                    <div className="mt-auto flex items-center justify-between text-muted-foreground group-hover:text-primary transition-colors">
                      <span className="text-xs tracking-widest uppercase font-semibold">Comprar</span>
                      <ShoppingBag size={18} className="group-hover:-translate-y-1 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                </a>

                {/* Portuguese Option */}
                <a 
                  href="https://amazon.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group relative overflow-hidden rounded-2xl border border-border bg-white p-6 hover:border-primary/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 flex flex-col h-full">
                    <h4 className="font-display text-2xl text-foreground mb-2">{t.featured.portugueseVersion}</h4>
                    <div className="flex gap-1 mb-8">
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-primary text-primary" />)}
                    </div>
                    <div className="mt-auto flex items-center justify-between text-muted-foreground group-hover:text-primary transition-colors">
                      <span className="text-xs tracking-widest uppercase font-semibold">Comprar</span>
                      <ShoppingBag size={18} className="group-hover:-translate-y-1 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                </a>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
