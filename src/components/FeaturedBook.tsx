import { motion } from 'framer-motion';
import bookDiaspora from '@/assets/book-diaspora.jpg';
import { Star } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

export function FeaturedBook() {
  const { t } = useLanguage();

  return (
    <section id="obras" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="inline-block bg-primary text-primary-foreground px-6 py-2 text-sm tracking-widest uppercase mb-6">{t.featured.badge}</span>
          <h2 className="font-display text-4xl md:text-6xl text-foreground tracking-wide mb-4">{t.featured.title}</h2>
          <p className="text-xl text-muted-foreground font-display italic">{t.featured.subtitle}</p>
        </motion.div>

        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-16">{t.featured.description}</p>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Spanish */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-card rounded-lg shadow-lg p-5 sm:p-6 flex flex-col sm:flex-row gap-5 sm:gap-6">
            <img src={bookDiaspora} alt="Diáspora - Español" className="w-28 sm:w-36 h-auto rounded shadow-md flex-shrink-0 object-cover mx-auto sm:mx-0" />
            <div className="flex flex-col text-center sm:text-left">
              <h3 className="font-display text-xl mb-1">{t.featured.spanishVersion}</h3>
              <p className="text-sm text-muted-foreground mb-3">{t.featured.spanishSubtitle}</p>
              <div className="flex gap-0.5 mb-4 justify-center sm:justify-start">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-primary text-primary" />)}
              </div>
              <p className="text-sm text-muted-foreground mb-6 flex-grow line-clamp-4">{t.featured.spanishDesc}</p>
              <a href="https://amazon.com" target="_blank" rel="noopener noreferrer" className="btn-primary text-center">{t.featured.buyAmazon}</a>
              <p className="text-xs text-muted-foreground italic mt-2 text-center">{t.featured.availableFormats}</p>
            </div>
          </motion.div>

          {/* Portuguese */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-card rounded-lg shadow-lg p-5 sm:p-6 flex flex-col sm:flex-row gap-5 sm:gap-6">
            <img src={bookDiaspora} alt="Diáspora - Português" className="w-28 sm:w-36 h-auto rounded shadow-md flex-shrink-0 object-cover mx-auto sm:mx-0" />
            <div className="flex flex-col text-center sm:text-left">
              <h3 className="font-display text-xl mb-1">{t.featured.portugueseVersion}</h3>
              <p className="text-sm text-muted-foreground mb-3">{t.featured.portugueseSubtitle}</p>
              <div className="flex gap-0.5 mb-4 justify-center sm:justify-start">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-primary text-primary" />)}
              </div>
              <p className="text-sm text-muted-foreground mb-6 flex-grow line-clamp-4">{t.featured.portugueseDesc}</p>
              <a href="https://amazon.com" target="_blank" rel="noopener noreferrer" className="btn-primary text-center">{t.featured.buyAmazonPt}</a>
              <p className="text-xs text-muted-foreground italic mt-2 text-center">{t.featured.availableFormatsPt}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
