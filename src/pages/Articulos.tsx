import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { useArticles } from '@/hooks/useArticles';
import { useLanguage } from '@/i18n/LanguageContext';
import { motion } from 'framer-motion';
import { Download, FileText, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function Articulos() {
  const { articles, isLoading } = useArticles();
  const { lang, t } = useLanguage();
  const [filter, setFilter] = useState<'todos' | 'la_voce_d_italia' | 'otros'>('todos');

  const filteredArticles = articles.filter(a => filter === 'todos' || a.category === filter);

  return (
    <div className="min-h-screen flex flex-col bg-muted/40">
      <Header />
      
      {/* Premium Hero Banner */}
      <div className="relative bg-hero text-hero-foreground pt-36 pb-20 overflow-hidden shadow-lg">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/50 via-transparent to-transparent" />
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 text-primary-foreground mb-6 text-xs font-semibold tracking-widest uppercase border border-primary/30 backdrop-blur-md shadow-sm">
                <FileText size={14} />
                <span>Publicaciones</span>
              </div>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight text-white">
                {t.nav.articulos}
              </h1>
              <p className="text-hero-foreground/80 text-lg md:text-xl font-light leading-relaxed">
                {lang === 'es' 
                  ? 'Explora artículos, ensayos y publicaciones destacadas de Michele Castelli a lo largo de los años.'
                  : 'Esplora articoli, saggi e pubblicazioni in primo piano di Michele Castelli nel corso degli anni.'}
              </p>
            </motion.div>
            {/* Filter Tabs in Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="w-full lg:w-auto"
            >
              <div className="flex bg-white/10 backdrop-blur-md p-1.5 rounded-2xl shadow-inner border border-white/20 overflow-x-auto">
                <button 
                  onClick={() => setFilter('todos')}
                  className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${filter === 'todos' ? 'bg-white text-black shadow-md' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
                >
                  {lang === 'es' ? 'Todos' : 'Tutti'}
                </button>
                <button 
                  onClick={() => setFilter('la_voce_d_italia')}
                  className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${filter === 'la_voce_d_italia' ? 'bg-white text-black shadow-md' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
                >
                  La voce d'Italia
                </button>
                <button 
                  onClick={() => setFilter('otros')}
                  className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${filter === 'otros' ? 'bg-white text-black shadow-md' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
                >
                  {lang === 'es' ? 'Otros' : 'Altri'}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <main className="flex-1 py-10 md:py-16">
        <div className="container mx-auto px-6 max-w-7xl">

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-50">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground animate-pulse">
                {lang === 'es' ? 'Cargando artículos...' : 'Caricamento articoli...'}
              </p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in-up">
              <div className="w-24 h-24 bg-muted/30 border border-border/50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <FileText className="h-10 w-10 text-muted-foreground/50" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-display text-foreground mb-3">
                {lang === 'es' ? 'No hay artículos' : 'Nessun articolo'}
              </h3>
              <p className="text-muted-foreground text-lg max-w-md mx-auto font-light">
                {lang === 'es' 
                  ? 'Actualmente no hay artículos publicados en esta categoría.' 
                  : 'Al momento non ci sono articoli pubblicati in questa categoria.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredArticles.map((article, index) => (
                <Card 
                  key={article.id} 
                  className="overflow-hidden group hover:shadow-2xl transition-all duration-500 border-border/40 bg-card rounded-2xl flex flex-col h-full hover:-translate-y-2 relative animate-fade-in-up"
                  style={{ animationDelay: `${0.1 + (index * 0.05)}s` }}
                >
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-primary/30 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  
                  <CardHeader className="p-8 flex-1 flex flex-col items-start gap-4 relative overflow-hidden bg-gradient-to-b from-muted/30 to-transparent">

                    
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {article.year && <span className="text-primary">{article.year}</span>}
                        {article.year && <span className="opacity-50">&bull;</span>}
                        <span className="truncate opacity-80">
                          {article.category === 'la_voce_d_italia' ? "La voce d'Italia" : (lang === 'es' ? 'Otros' : 'Altri')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0 w-full mt-2 relative z-10">
                      <h3 className="font-display font-medium text-lg leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-3">
                        {article.title}
                      </h3>
                    </div>
                  </CardHeader>
                  
                  <div className="p-2 border-t border-border/50 shrink-0 bg-card z-10">
                    <Button 
                      variant="ghost"
                      className="w-full justify-between h-12 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors font-medium group/btn px-4"
                      asChild
                    >
                      <a href={article.pdf_url} target="_blank" rel="noopener noreferrer">
                        <span>{lang === 'es' ? 'Leer Artículo' : 'Leggi Articolo'}</span>
                        <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover/btn:bg-primary group-hover/btn:text-primary-foreground transition-colors">
                          <Download className="h-4 w-4" />
                        </span>
                      </a>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
