 import { motion } from 'framer-motion';
 import { ChevronLeft, ChevronRight } from 'lucide-react';
 import { useState } from 'react';
 
 import bookDiaspora from '@/assets/book-diaspora.jpg';
 import bookAutobiografia from '@/assets/book-autobiografia.jpg';
 import bookFiabe from '@/assets/book-fiabe.jpg';
 
 const books = [
   {
     id: 1,
     title: 'Autobiografía',
     image: bookAutobiografia,
   },
   {
     id: 2,
     title: 'Dieci Fiabe per i miei Nipotini',
     image: bookFiabe,
   },
   {
     id: 3,
     title: 'Il Tesoro Sfumato',
     image: bookDiaspora,
   },
   {
     id: 4,
     title: 'Diáspora',
     image: bookDiaspora,
   },
   {
     id: 5,
     title: 'Diaspora (Português)',
     image: bookDiaspora,
   },
 ];
 
 export function BooksCarousel() {
   const [startIndex, setStartIndex] = useState(0);
   const visibleCount = 4;
 
   const handlePrev = () => {
     setStartIndex((prev) => (prev === 0 ? books.length - visibleCount : prev - 1));
   };
 
   const handleNext = () => {
     setStartIndex((prev) => (prev >= books.length - visibleCount ? 0 : prev + 1));
   };
 
   const visibleBooks = [];
   for (let i = 0; i < visibleCount; i++) {
     visibleBooks.push(books[(startIndex + i) % books.length]);
   }
 
   return (
     <section className="py-24 bg-hero relative overflow-hidden">
       {/* Forest background overlay */}
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
           Los más leídos
         </motion.h2>
 
         <div className="relative flex items-center">
           {/* Prev Button */}
           <button
             onClick={handlePrev}
             className="absolute left-0 z-20 p-2 text-white/70 hover:text-white transition-colors"
             aria-label="Previous books"
           >
             <ChevronLeft size={40} />
           </button>
 
           {/* Books Grid */}
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
                 >
                   <div className="relative overflow-hidden rounded-lg shadow-2xl transition-transform duration-300 group-hover:scale-105">
                     <img
                       src={book.image}
                       alt={book.title}
                       className="w-full aspect-[2/3] object-cover"
                     />
                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                   </div>
                   <p className="text-white/80 text-center mt-3 text-sm font-medium">
                     {book.title}
                   </p>
                 </motion.div>
               ))}
             </div>
           </div>
 
           {/* Next Button */}
           <button
             onClick={handleNext}
             className="absolute right-0 z-20 p-2 text-white/70 hover:text-white transition-colors"
             aria-label="Next books"
           >
             <ChevronRight size={40} />
           </button>
         </div>
       </div>
     </section>
   );
 }