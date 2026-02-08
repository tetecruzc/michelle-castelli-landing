import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowLeft } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BookDetailModal } from '@/components/BookDetailModal';
import { books, type Book } from '@/data/books';
import { useLanguage } from '@/i18n/LanguageContext';

const Obras = () => {
  const { lang, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const filtered = books.filter((b) =>
    b.title[lang].toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-28 pb-16">
        <div className="container mx-auto px-6">
          {/* Back link */}
          <a href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 text-sm">
            <ArrowLeft size={16} />
            {t.nav.inicio}
          </a>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-6xl text-primary mb-4">{t.books.title}</h1>
            <p className="text-muted-foreground">{t.books.subtitle}</p>
          </motion.div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-12 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder={t.books.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filtered.map((book, i) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group cursor-pointer"
                onClick={() => setSelectedBook(book)}
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={book.cover}
                    alt={book.title[lang]}
                    className="w-full aspect-[2/3] object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

                  {/* Status badge */}
                  {book.action === 'not-digitized' && (
                    <span className="absolute top-2 right-2 bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded uppercase tracking-wide">
                      {t.books.notDigitized}
                    </span>
                  )}
                </div>
                <p className="text-foreground/80 text-center mt-3 text-sm font-medium line-clamp-2">
                  {book.title[lang]}
                </p>
                <p className="text-muted-foreground text-center text-xs">{book.year}</p>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No se encontraron resultados.</p>
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
