import bookDiaspora from '@/assets/book-diaspora.jpg';
import type { Book } from '@/data/books';
import { useBooks } from '@/hooks/useBooks';
import { useLanguage } from '@/i18n/LanguageContext';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export function FeaturedBook() {
  const { lang, t } = useLanguage();
  const { books } = useBooks();

  // Find all books that have "diaspora" or "diáspora" in their title
  const diasporaBooks = books.filter(b => 
    b.title.es.toLowerCase().includes('diaspora') || 
    b.title.es.toLowerCase().includes('diáspora')
  );

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [purchaseBook, setPurchaseBook] = useState<Book | null>(null);

  useEffect(() => {
    if (diasporaBooks.length > 0 && !selectedBook) {
      setSelectedBook(diasporaBooks[0]);
    }
  }, [diasporaBooks, selectedBook]);

  const displayCover = selectedBook ? selectedBook.cover : bookDiaspora;

  return (
    <section id="obras" className="relative py-32 bg-white overflow-hidden">
      {/* Premium Background Glow (Light Mode) */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-28 items-center">
          
          {/* Left Side: Large Book Cover with 3D feel */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }} 
            whileInView={{ opacity: 1, scale: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            className="w-full lg:w-5/12 relative flex justify-center lg:justify-end"
          >
            <div className="relative group perspective-[1000px] w-[220px] sm:w-[280px] lg:w-full lg:max-w-sm aspect-[2/3]">
              {/* Glow behind book */}
              <div className="absolute -inset-8 bg-gradient-to-r from-primary/10 to-orange-500/10 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700 -z-10 rounded-full" />
              
              <AnimatePresence mode="wait">
                <motion.img 
                  key={displayCover}
                  initial={{ opacity: 0, y: 10, rotateY: 10 }}
                  animate={{ opacity: 1, y: 0, rotateY: 0 }}
                  exit={{ opacity: 0, y: -10, rotateY: -10 }}
                  transition={{ duration: 0.3 }}
                  src={displayCover} 
                  alt="Diáspora" 
                  className="absolute inset-0 w-full h-full object-cover rounded shadow-2xl shadow-black/20 group-hover:-translate-y-4 group-hover:scale-[1.02] group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] transition-all duration-700" 
                />
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right Side: Content */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-7/12 flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary text-primary-foreground mb-3 text-xs font-medium tracking-widest uppercase shadow-sm">
              <span> {t.featured.badge}</span>
            </div>
            
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 tracking-tight mb-4">
              {t.featured.title}
            </h2>
            <p className="text-xl md:text-2xl text-primary font-display italic mb-4">
              {t.featured.subtitle}
            </p>

            <p className="text-foreground/80 leading-relaxed mb-10 text-base md:text-lg font-light">
              {t.featured.description}
            </p>

            {/* Language Editions - Premium Cards */}
            <div className="space-y-6 w-full">
              <h3 className="text-xs tracking-widest uppercase text-muted-foreground font-medium mb-4">
                Ediciones Disponibles
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
                {diasporaBooks.length === 0 ? (
                  <p className="text-sm text-muted-foreground col-span-full">Cargando ediciones...</p>
                ) : (
                  diasporaBooks.map(book => {
                    const isSelected = selectedBook?.id === book.id;
                    
                    const langWord = (book.title[lang] || book.title.es).split(' ').pop()?.replace(/\.$/, '') || '';
                    const lowerLang = langWord.toLowerCase();
                    let flag = '🌍';
                    if (lowerLang === 'español') flag = '🇪🇸';
                    else if (lowerLang === 'italiano') flag = '🇮🇹';
                    else if (lowerLang === 'portugués' || lowerLang === 'portugues') flag = '🇵🇹';

                    const links = [];
                    if (book.buyLinks?.usd) links.push({ label: 'USD / EUR', url: book.buyLinks.usd });
                    if (book.buyLinks?.ves) links.push({ label: 'Bs / Zelle / Binance', url: book.buyLinks.ves });
                    if (book.downloadUrl) links.push({ label: 'PDF', url: book.downloadUrl });

                    const isMultiLink = links.length > 1;
                    const primaryLink = links[0]?.url || '#';
                    const methodsStr = links.length > 0 ? links.map(l => l.label).join(' / ') : 'Consultar';

                    const cardClassName = `group relative overflow-hidden rounded-2xl border bg-white p-5 transition-all duration-500 flex flex-col w-full text-left ${
                      isSelected 
                        ? 'border-primary/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] scale-[1.02] z-10' 
                        : 'border-border hover:border-primary/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]'
                    }`;

                    const cardContent = (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative z-10 flex flex-col h-full">
                          <h4 className="font-display text-2xl text-foreground mb-3 leading-snug capitalize flex items-center justify-between">
                            {langWord}
                            <span className="text-2xl drop-shadow-sm">{flag}</span>
                          </h4>
                          
                          <div className="mt-auto pt-4 border-t border-border/50 flex flex-col gap-2">
                            <div className="flex items-center justify-between text-muted-foreground group-hover:text-primary transition-colors">
                              <span className="text-[10px] tracking-widest uppercase font-semibold">Disponible en</span>
                              <ShoppingBag size={16} className="group-hover:-translate-y-1 group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <span className="text-xs font-medium text-foreground">{methodsStr}</span>
                          </div>
                        </div>
                      </>
                    );

                    return isMultiLink ? (
                      <button 
                        key={book.id}
                        onClick={() => setPurchaseBook(book)}
                        onMouseEnter={() => setSelectedBook(book)}
                        className={cardClassName}
                      >
                        {cardContent}
                      </button>
                    ) : (
                      <a 
                        key={book.id}
                        href={primaryLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        onMouseEnter={() => setSelectedBook(book)}
                        className={cardClassName}
                      >
                        {cardContent}
                      </a>
                    );
                  })
                )}
              </div>
            </div>

          </motion.div>
        </div>
      </div>

      {/* Purchase Modal */}
      <AnimatePresence>
        {purchaseBook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-border relative"
            >
              <button 
                onClick={() => setPurchaseBook(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <X size={20} className="text-muted-foreground" />
              </button>
              
              <div className="p-6 pt-8">
                 <h3 className="text-2xl font-display font-bold mb-2">Comprar edición</h3>
                 <p className="text-muted-foreground mb-6 text-sm">Selecciona la plataforma de tu preferencia para adquirir la versión en <strong className="capitalize text-foreground">{(purchaseBook.title[lang] || purchaseBook.title.es).split(' ').pop()?.replace(/\.$/, '')}</strong>.</p>
                 
                 <div className="flex flex-col gap-3">
                   {purchaseBook.buyLinks?.usd && (
                     <a href={purchaseBook.buyLinks.usd} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 hover:shadow-md transition-all group">
                       <div className="flex flex-col text-left">
                         <span className="font-semibold text-foreground group-hover:text-primary transition-colors text-lg">Amazon</span>
                         <span className="text-xs text-muted-foreground">Pago en USD / EUR</span>
                       </div>
                       <ShoppingBag size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                     </a>
                   )}
                   {purchaseBook.buyLinks?.ves && (
                     <a href={purchaseBook.buyLinks.ves} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 hover:shadow-md transition-all group">
                       <div className="flex flex-col text-left">
                         <span className="font-semibold text-foreground group-hover:text-primary transition-colors text-lg">Guaybo</span>
                         <span className="text-xs text-muted-foreground">Pago en Bs / Zelle / Binance</span>
                       </div>
                       <ShoppingBag size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                     </a>
                   )}
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
