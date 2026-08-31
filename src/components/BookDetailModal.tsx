import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, ShoppingCart, ChevronDown, BookX } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import type { Book } from '@/data/books';
import { cn } from '@/lib/utils';

interface BookDetailModalProps {
  book: Book | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookDetailModal({ book, open, onOpenChange }: BookDetailModalProps) {
  const { lang, t } = useLanguage();
  
  // Index of the currently viewed image. -1 means cover, 0+ means related images.
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  // Reset selected image when book changes or modal closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => setSelectedIndex(-1), 300); // Wait for transition
    } else {
      setSelectedIndex(-1);
    }
  }, [book, open]);

  if (!book) return null;

  const currentImageSrc = selectedIndex === -1 ? book.cover : book.images?.[selectedIndex]?.src;
  const currentCaption = selectedIndex === -1 ? null : book.images?.[selectedIndex]?.caption[lang];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* We use Visually Hidden DialogTitle to satisfy accessibility warnings if needed, but here we can just render DialogTitle normally in the UI */}
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] md:h-[85vh] p-0 overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl flex flex-col md:flex-row gap-0 [&>button]:text-white [&>button]:opacity-70 hover:[&>button]:opacity-100 [&>button_svg]:w-6 [&>button_svg]:h-6 [&>button]:drop-shadow-md [&>button]:z-50">
        
        {/* LEFT SIDE: Image Viewer */}
        <div className="flex-1 bg-black/95 flex flex-col relative overflow-hidden min-h-[40vh]">
          {/* Blurred Background */}
          {currentImageSrc && (
            <div 
              className="absolute inset-0 bg-cover bg-center blur-3xl opacity-30 scale-110 transition-all duration-700" 
              style={{ backgroundImage: `url(${currentImageSrc})` }} 
            />
          )}
          
          {/* Main Image */}
          <div className="flex-1 min-h-0 p-4 md:p-8 flex items-center justify-center relative z-10">
            {currentImageSrc && (
              <img
                key={currentImageSrc}
                src={currentImageSrc}
                alt={book.title[lang]}
                className="w-full h-full object-contain drop-shadow-2xl animate-fade-in"
              />
            )}
          </div>

          {/* Thumbnails Bar (only if there are related images) */}
          {book.images && book.images.length > 0 && (
            <div className="h-24 bg-black/60 backdrop-blur-md border-t border-white/10 flex items-center px-4 gap-3 overflow-x-auto relative z-20 shrink-0">
              {/* Cover Thumbnail */}
              <button
                onClick={() => setSelectedIndex(-1)}
                className={cn(
                  "relative h-16 w-12 shrink-0 rounded-md overflow-hidden border-2 transition-all duration-200",
                  selectedIndex === -1 ? "border-primary scale-110 shadow-lg" : "border-transparent opacity-50 hover:opacity-100"
                )}
              >
                <img src={book.cover} alt="Cover" className="w-full h-full object-cover" />
              </button>
              
              {/* Divider */}
              <div className="w-px h-8 bg-white/20 mx-1 shrink-0" />

              {/* Related Images Thumbnails */}
              {book.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={cn(
                    "relative h-16 aspect-video shrink-0 rounded-md overflow-hidden border-2 transition-all duration-200",
                    selectedIndex === idx ? "border-primary scale-110 shadow-lg" : "border-transparent opacity-50 hover:opacity-100"
                  )}
                >
                  <img src={img.src} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDE: Information */}
        <div className="w-full md:w-[450px] lg:w-[550px] bg-zinc-900 flex flex-col border-t md:border-t-0 md:border-l border-white/10 shrink-0 relative overflow-hidden">
          
          <div className="p-6 md:p-8 flex-1 overflow-y-auto no-scrollbar">
            <div className="mb-6">
              <DialogTitle className="font-display text-2xl md:text-3xl text-white mb-2 leading-tight">
                {book.title[lang]}
              </DialogTitle>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
                {t.books.year}: {book.year}
              </div>
            </div>

            <div className="prose prose-invert prose-sm md:prose-base max-w-none mb-8">
              <p className="text-zinc-300 font-light leading-relaxed whitespace-pre-wrap">
                {book.description[lang]}
              </p>
            </div>

            {/* If looking at a related image with a caption, show it distinctly */}
            {currentCaption && (
              <div className="mt-4 mb-8 p-4 bg-white/5 rounded-xl border border-white/10 animate-fade-in-up">
                <p className="text-sm text-zinc-200 italic border-l-2 border-primary pl-3">
                  "{currentCaption}"
                </p>
              </div>
            )}

          </div>

          {/* Fixed Footer for Action Buttons */}
          <div className="p-6 md:p-8 bg-zinc-950/80 backdrop-blur-md border-t border-white/10 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            <div className="space-y-4">
              {book.action === 'buy' && (book.buyLinks?.ves || book.buyLinks?.usd) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-full justify-between h-12 text-base font-medium shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                      <span className="flex items-center gap-2">
                        <ShoppingCart size={18} />
                        {t.books.buy}
                      </span>
                      <ChevronDown size={18} className="opacity-70" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[300px] bg-zinc-800 border-zinc-700">
                    {book.buyLinks?.ves && (
                      <DropdownMenuItem asChild className="p-3 cursor-pointer hover:bg-zinc-700 focus:bg-zinc-700 text-zinc-100">
                        <a href={book.buyLinks.ves} target="_blank" rel="noopener noreferrer">
                          <ShoppingCart size={16} className="mr-3 text-primary" />
                          <span className="font-medium">{t.books.buyVes}</span>
                        </a>
                      </DropdownMenuItem>
                    )}
                    {book.buyLinks?.usd && (
                      <DropdownMenuItem asChild className="p-3 cursor-pointer hover:bg-zinc-700 focus:bg-zinc-700 text-zinc-100">
                        <a href={book.buyLinks.usd} target="_blank" rel="noopener noreferrer">
                          <ShoppingCart size={16} className="mr-3 text-primary" />
                          <span className="font-medium">{t.books.buyUsd}</span>
                        </a>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {book.action === 'download' && (
                <Button asChild className="w-full h-12 text-base font-medium shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                  <a href={book.downloadUrl || '#'} target="_blank" rel="noopener noreferrer">
                    <Download size={18} className="mr-2" />
                    {t.books.download}
                  </a>
                </Button>
              )}

              {book.action === 'not-digitized' && (
                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <BookX size={20} className="text-zinc-400" />
                  </div>
                  <div>
                    <p className="font-medium text-zinc-100">{t.books.notDigitized}</p>
                    <p className="text-sm text-zinc-400 mt-1">{t.books.notDigitizedDesc}</p>
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
