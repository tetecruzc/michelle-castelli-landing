import { useLanguage } from '@/i18n/LanguageContext';
import { motion } from 'framer-motion';

export function Hero() {
  const { t } = useLanguage();

  return (
    <section id="inicio" className="relative min-h-[95vh] md:min-h-[85vh] flex items-center justify-start overflow-hidden bg-black">
      <div className="absolute right-0 bottom-0 w-full h-full md:w-1/2 flex justify-end items-end pointer-events-none">
        <img src="/michele-castelli-banner.png" alt="Michele Castelli" className="max-h-full object-contain opacity-50 md:opacity-100" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent md:hidden pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6 py-32">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }} className="max-w-2xl">
          <h1 className="font-display text-5xl md:text-7xl text-white tracking-wider mb-6">Michele Castelli</h1>
          <div className="flex items-center gap-4 mb-8">
            <span className="w-12 h-px bg-white/60" />
            <p className="text-white/80 tracking-widest uppercase text-sm">{t.hero.subtitle}</p>
            <span className="w-12 h-px bg-white/60" />
          </div>
          <p className="text-white/70 text-lg mb-10 leading-relaxed max-w-lg font-light">{t.hero.description}</p>
          <a href="#contacto" className="btn-hero inline-block">{t.hero.cta}</a>
        </motion.div>
      </div>

      {/* <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/50 to-white/20" />
        </div>
      </motion.div> */}
    </section>
  );
}
