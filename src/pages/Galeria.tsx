import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { GalleryPhoto, useGallery } from '@/hooks/useGallery';
import { useLanguage } from '@/i18n/LanguageContext';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, Image as ImageIcon, Loader2, PlayCircle, X } from 'lucide-react';
import { useState } from 'react';

const CATEGORIES = [
  { id: 1, name: 'Homenajes' },
  { id: 2, name: 'Mi familia' },
  { id: 3, name: 'Vida universitaria' },
  { id: 4, name: 'Mis viajes' },
  { id: 5, name: 'Varios' },
  { id: 6, name: 'Condecoraciones' },
];

export default function Galeria() {
  const { lang, t } = useLanguage();
  const { photos, isLoading } = useGallery();
  const [activeCategory, setActiveCategory] = useState<number>(1);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  const filteredPhotos = photos.filter(p => p.category_id === activeCategory);

  return (
    <div className="min-h-screen flex flex-col bg-muted/40">
      <Header />
      
      {/* Premium Hero Banner */}
      <div className="relative bg-hero text-hero-foreground pt-36 overflow-hidden shadow-lg">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/50 via-transparent to-transparent" />
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 text-primary-foreground mb-6 text-xs font-semibold tracking-widest uppercase border border-primary/30 backdrop-blur-md shadow-sm">
              <ImageIcon size={14} />
              <span>Álbum Fotográfico</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight text-white">
              {t.nav.galeria}
            </h1>
            <p className="text-hero-foreground/80 text-lg md:text-xl font-light leading-relaxed">
              {lang === 'es' 
                ? 'Un recorrido visual a través de los momentos más importantes de mi vida personal y profesional.'
                : 'Un viaggio visivo attraverso i momenti più importanti della mia vita personale e professionale.'}
            </p>
          </motion.div>
        </div>

        {/* Full-width Tab Bar */}
        <div className="border-t border-white/10 bg-black/20 backdrop-blur-md relative z-10">
          <div className="container mx-auto px-6 max-w-7xl overflow-x-auto no-scrollbar">
            <div className="h-14 flex items-center gap-6 justify-start">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`py-4 px-2 text-sm font-medium transition-all whitespace-nowrap border-b-2 -mb-[2px] ${
                    activeCategory === cat.id 
                      ? 'border-white text-white' 
                      : 'border-transparent text-white/70 hover:text-white hover:border-white/50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <main className="flex-1 py-10 md:py-16">
        <div className="container mx-auto px-6 max-w-7xl">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-50">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground animate-pulse">
                {lang === 'es' ? 'Cargando galería...' : 'Caricamento galleria...'}
              </p>
            </div>
          ) : filteredPhotos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in-up">
              <div className="w-24 h-24 bg-muted/30 border border-border/50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <ImageIcon className="h-10 w-10 text-muted-foreground/50" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-display text-foreground mb-3">
                {lang === 'es' ? 'No hay fotos' : 'Nessuna foto'}
              </h3>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
              {filteredPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index % 10) * 0.05 }}
                  className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 border border-border/50 bg-background"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img 
                    src={photo.image_url} 
                    alt="Gallery item" 
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                    <p className="text-white text-sm line-clamp-3 font-medium">
                      {photo.text}
                    </p>
                    {(photo.video_url || (photo.links && photo.links.length > 0)) && (
                      <div className="flex gap-2 mt-3">
                        {photo.video_url && <PlayCircle className="text-primary w-5 h-5" />}
                        {photo.links && photo.links.length > 0 && <ExternalLink className="text-primary w-5 h-5" />}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12 bg-black/95 backdrop-blur-sm"
            onClick={() => setSelectedPhoto(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-50 bg-black/50 p-2 rounded-full hover:bg-white/10"
              onClick={() => setSelectedPhoto(null)}
            >
              <X size={24} />
            </button>

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-6xl max-h-full flex flex-col md:flex-row bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Section */}
              <div className="flex-1 bg-black/90 flex items-center justify-center relative min-h-[40vh] md:min-h-[60vh] overflow-hidden p-4 md:p-8">
                {/* Blurred Background */}
                <div 
                  className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-110" 
                  style={{ backgroundImage: `url(${selectedPhoto.image_url})` }} 
                />
                <img 
                  src={selectedPhoto.image_url} 
                  alt="Gallery fullsize" 
                  className="w-full h-full max-h-[75vh] md:max-h-[85vh] object-contain relative z-10 drop-shadow-2xl"
                />
              </div>

              {/* Sidebar Info Section */}
              <div className="w-full md:w-96 bg-zinc-900 p-6 md:p-8 flex flex-col border-t md:border-t-0 md:border-l border-white/10 overflow-y-auto max-h-[50vh] md:max-h-none">
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary mb-4 text-xs font-semibold uppercase tracking-wider">
                    {CATEGORIES.find(c => c.id === selectedPhoto.category_id)?.name}
                  </div>
                  <p className="text-zinc-300 text-base md:text-lg leading-relaxed font-light">
                    {selectedPhoto.text}
                  </p>
                </div>

                <div className="mt-auto space-y-4">
                  {selectedPhoto.video_url && (
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Video</p>
                      <Button asChild variant="outline" className="w-full justify-start gap-3 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:text-white text-zinc-300">
                        <a href={selectedPhoto.video_url} target="_blank" rel="noopener noreferrer">
                          <PlayCircle size={18} className="text-primary" />
                          <span>Ver Video</span>
                        </a>
                      </Button>
                    </div>
                  )}

                  {selectedPhoto.links && selectedPhoto.links.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Enlaces</p>
                      {selectedPhoto.links.map((link, idx) => (
                        <Button key={idx} asChild variant="outline" className="w-full justify-start gap-3 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:text-white text-zinc-300">
                          <a href={link.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink size={18} className="text-primary" />
                            <span className="truncate">{link.text}</span>
                          </a>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
