import { BookDetailModal } from '@/components/BookDetailModal';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import type { Book } from '@/data/books';
import { useBooks } from '@/hooks/useBooks';
import { useLanguage } from '@/i18n/LanguageContext';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Search } from 'lucide-react';
import { useState } from 'react';

const CATEGORIES = [
  { id: 'all', label: 'Todas' },
  { id: 'translated', label: 'Traducciones' },
  { id: 'italian', label: 'En Italiano' },
  { id: 'spanish', label: 'En Español' },
  { id: 'dialecto', label: 'En Dialecto' }
];

const normalizeText = (text: string) => {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const Obras = () => {
  const { lang, t } = useLanguage();
  const { books, isLoading } = useBooks();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const filtered = books.filter((b) => {
    const matchesSearch = normalizeText(b.title[lang]).includes(normalizeText(search));
    const matchesCategory = selectedCategory === 'all' || (b.categories && b.categories.includes(selectedCategory));
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-section-alt/30">
      <Header />

      {/* Premium Hero Banner */}
      <div className="relative bg-hero text-hero-foreground pt-36 overflow-hidden shadow-lg">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/50 via-transparent to-transparent" />
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10 pb-16">
          {/* <a href="/" className="inline-flex items-center gap-2 text-hero-foreground/70 hover:text-white transition-all duration-300 mb-8 text-sm group">
            <span className="group-hover:-translate-x-1 transition-transform duration-300">
              <ArrowLeft size={16} />
            </span>
            {t.nav.inicio}
          </a> */}

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 text-primary-foreground mb-6 text-xs font-semibold tracking-widest uppercase border border-primary/30 backdrop-blur-md shadow-sm">
                <BookOpen size={14} />
                <span>Catálogo Literario</span>
              </div>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight text-white">
                {t.books.title}
              </h1>
              <p className="text-hero-foreground/80 text-lg md:text-xl font-light leading-relaxed">
                {t.books.subtitle}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="w-full lg:w-auto lg:min-w-[400px] relative group"
            >
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 z-10 pointer-events-none" size={18} />
                <input
                  type="text"
                  placeholder={t.books.searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-6 py-3 rounded-full border border-white/10 bg-white/10 backdrop-blur-md text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-primary/80 transition-all shadow-inner text-base"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Full-width Tab Bar */}
        <div className="border-t border-white/10 bg-black/20 backdrop-blur-md relative z-10">
          <div className="container mx-auto px-6 max-w-7xl overflow-x-auto no-scrollbar">
            <div className="h-14 flex items-center gap-6 justify-start">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`py-4 px-2 text-sm font-medium transition-all whitespace-nowrap border-b-2 -mb-[2px] ${
                    selectedCategory === cat.id 
                      ? 'border-white text-white' 
                      : 'border-transparent text-white/70 hover:text-white hover:border-white/50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-10 md:py-16">
        <div className="container mx-auto px-6 max-w-7xl">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-12">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex flex-col animate-pulse">
                  <div className="w-full aspect-[2/3] bg-muted/60 rounded-2xl mb-4" />
                  <div className="h-5 bg-muted/60 rounded w-3/4 mx-auto mb-2 mt-1" />
                  <div className="h-4 bg-muted/60 rounded w-1/3 mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Books Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-12">
                <AnimatePresence>
                  {filtered.map((book, i) => (
                    <motion.div
                      layout
                      key={book.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                      className="group cursor-pointer flex flex-col"
                      onClick={() => setSelectedBook(book)}
                    >
                      <div className="relative overflow-hidden rounded-2xl shadow-md group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 mb-4">
                        <img
                          src={book.cover}
                          alt={book.title[lang]}
                          className="w-full aspect-[2/3] object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Status badge */}
                        {book.action === 'not-digitized' && (
                          <span className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm text-foreground text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold shadow-sm">
                            {t.books.notDigitized}
                          </span>
                        )}
                      </div>
                      <h3 className="text-foreground text-center text-base md:text-lg font-semibold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                        {book.title[lang]}
                      </h3>
                      <p className="text-muted-foreground text-center text-sm mt-1">{book.year}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {filtered.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center text-center mt-12 mb-12"
                >
                  <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mb-6">
                    <BookOpen className="text-muted-foreground w-12 h-12 opacity-50" />
                  </div>
                  <h3 className="text-2xl font-display font-semibold text-foreground mb-2">
                    No hay resultados
                  </h3>
                  <p className="text-muted-foreground max-w-sm">
                    No pudimos encontrar ningún libro que coincida con "{search}". Intenta con otros términos.
                  </p>
                </motion.div>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />

      <BookDetailModal
        book={selectedBook}
        open={!!selectedBook}
        onOpenChange={(open) => !open && setSelectedBook(null)}
      />
    </div>
  );
};

export default Obras;
