import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, ShoppingCart, ChevronDown, BookX } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import type { Book } from '@/data/books';

interface BookDetailModalProps {
  book: Book | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookDetailModal({ book, open, onOpenChange }: BookDetailModalProps) {
  const { lang, t } = useLanguage();

  if (!book) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl md:text-3xl text-primary">
            {book.title[lang]}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t.books.year}: {book.year}
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-[200px_1fr] gap-6 mt-4">
          {/* Cover */}
          <img
            src={book.cover}
            alt={book.title[lang]}
            className="w-full rounded-lg shadow-lg object-cover aspect-[2/3]"
          />

          {/* Info */}
          <div className="flex flex-col gap-4">
            <p className="text-foreground/80 leading-relaxed">
              {book.description[lang]}
            </p>

            {/* Action Button */}
            <div className="mt-auto pt-4">
              {book.action === 'buy' && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="gap-2 w-full sm:w-auto">
                      <ShoppingCart size={18} />
                      {t.books.buy}
                      <ChevronDown size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-popover z-50">
                    {book.buyLinks?.ves && (
                      <DropdownMenuItem asChild>
                        <a href={book.buyLinks.ves} target="_blank" rel="noopener noreferrer">
                          {t.books.buyVes}
                        </a>
                      </DropdownMenuItem>
                    )}
                    {book.buyLinks?.usd && (
                      <DropdownMenuItem asChild>
                        <a href={book.buyLinks.usd} target="_blank" rel="noopener noreferrer">
                          {t.books.buyUsd}
                        </a>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {book.action === 'download' && (
                <Button asChild className="gap-2 w-full sm:w-auto">
                  <a href={book.downloadUrl || '#'} target="_blank" rel="noopener noreferrer">
                    <Download size={18} />
                    {t.books.download}
                  </a>
                </Button>
              )}

              {book.action === 'not-digitized' && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted border border-border">
                  <BookX size={24} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">{t.books.notDigitized}</p>
                    <p className="text-sm text-muted-foreground mt-1">{t.books.notDigitizedDesc}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Images */}
        {book.images && book.images.length > 0 && (
          <div className="mt-6 border-t border-border pt-6">
            <h4 className="font-display text-lg text-foreground mb-4">{t.books.relatedImages}</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {book.images.map((img, i) => (
                <div key={i} className="space-y-2">
                  <img
                    src={img.src}
                    alt={img.caption[lang]}
                    className="w-full rounded-lg shadow object-cover aspect-[4/3]"
                  />
                  <p className="text-xs text-muted-foreground text-center">{img.caption[lang]}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
