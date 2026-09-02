import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useBooks } from '@/hooks/useBooks';
import type { Book } from '@/data/books';
import { BookDetailModal } from '@/components/BookDetailModal';
import { useLanguage } from '@/i18n/LanguageContext';

export function BooksCarousel() {
  const { lang, t } = useLanguage();
  const { books: allBooks } = useBooks();
  const carouselBooks = allBooks.filter((b) => b.is_featured);
  const [startIndex, setStartIndex] = useState(0);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  
  const visibleCount = 4;
  const maxStartIndex = Math.max(0, Math.ceil(carouselBooks.length / visibleCount) * visibleCount - visibleCount);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - visibleCount));
  };

  const handleNext = () => {
    setStartIndex((prev) => Math.min(maxStartIndex, prev + visibleCount));
  };

  const canGoPrev = startIndex > 0;
  const canGoNext = startIndex < maxStartIndex;

  const visibleBooks = carouselBooks.slice(startIndex, startIndex + visibleCount);

  return (
    <section className="py-24 bg-hero relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/50" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-3xl md:text-5xl text-primary text-center mb-16 italic"
        >
          {t.carousel.title}
        </motion.h2>

        <div className="relative flex items-center">
          {canGoPrev && (
            <button 
              onClick={handlePrev} 
              className="absolute left-0 z-20 p-2 text-white/70 hover:text-white transition-all bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-sm" 
              aria-label="Previous"
            >
              <ChevronLeft size={40} />
            </button>
          )}

          <div className="flex-1 overflow-hidden mx-12">
            <AnimatePresence mode="wait">
              <motion.div 
                key={startIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6"
              >
                {visibleBooks.map((book, index) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="group cursor-pointer"
                    onClick={() => setSelectedBook(book)}
                  >
                    <div className="relative overflow-hidden rounded-lg shadow-2xl">
                      <img 
                        src={book.cover} 
                        alt={book.title[lang]} 
                        className="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>
                    <p className="text-white/80 text-center mt-4 text-sm md:text-base font-medium group-hover:text-white transition-colors">
                      {book.title[lang]}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {canGoNext && (
            <button 
              onClick={handleNext} 
              className="absolute right-0 z-20 p-2 text-white/70 hover:text-white transition-all bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-sm" 
              aria-label="Next"
            >
              <ChevronRight size={40} />
            </button>
          )}
        </div>
      </div>

      <BookDetailModal book={selectedBook} open={!!selectedBook} onOpenChange={(open) => !open && setSelectedBook(null)} />
    </section>
  );
}
