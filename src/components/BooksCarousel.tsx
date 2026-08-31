import { motion } from 'framer-motion';
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

  const handlePrev = () => {
    if (carouselBooks.length === 0) return;
    setStartIndex((prev) => {
      const step = visibleCount % carouselBooks.length;
      return (prev - step + carouselBooks.length) % carouselBooks.length;
    });
  };

  const handleNext = () => {
    if (carouselBooks.length === 0) return;
    setStartIndex((prev) => (prev + visibleCount) % carouselBooks.length);
  };

  const visibleBooks = [];
  if (carouselBooks.length > 0) {
    for (let i = 0; i < visibleCount; i++) {
      visibleBooks.push(carouselBooks[(startIndex + i) % carouselBooks.length]);
    }
  }

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
          <button onClick={handlePrev} className="absolute left-0 z-20 p-2 text-white/70 hover:text-white transition-colors" aria-label="Previous">
            <ChevronLeft size={40} />
          </button>

          <div className="flex-1 overflow-hidden mx-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {visibleBooks.map((book, index) => (
                <motion.div
                  key={`${book.id}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedBook(book)}
                >
                  <div className="relative overflow-hidden rounded-lg shadow-2xl">
                    <img src={book.cover} alt={book.title[lang]} className="w-full aspect-[2/3] object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>
                  <p className="text-white/80 text-center mt-3 text-sm font-medium">{book.title[lang]}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <button onClick={handleNext} className="absolute right-0 z-20 p-2 text-white/70 hover:text-white transition-colors" aria-label="Next">
            <ChevronRight size={40} />
          </button>
        </div>
      </div>

      <BookDetailModal book={selectedBook} open={!!selectedBook} onOpenChange={(open) => !open && setSelectedBook(null)} />
    </section>
  );
}
