import { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/i18n/LanguageContext';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  const navItems = [
    { label: t.nav.inicio, href: '/#inicio' },
    { label: t.nav.obras, href: '/obras' },
    { label: t.nav.sobreMi, href: '/#sobre-mi' },
    { label: t.nav.entrevistas, href: '/entrevistas' },
    { label: t.nav.articulos, href: '/articulos' },
    { label: t.nav.galeria, href: '/galeria' },
    { label: t.nav.contacto, href: '/#contacto' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLang = () => setLang(lang === 'es' ? 'it' : 'es');

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-sm shadow-sm py-4' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <a 
          href="/" 
          className={`font-display text-2xl tracking-wide transition-colors duration-300 ${
            isScrolled ? 'text-foreground' : 'text-white'
          }`}
        >
          <span className="border-b-2 border-current pb-1">MicheleCastelli</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`nav-link ${
                isScrolled ? 'text-foreground/80' : 'text-white/80'
              }`}
            >
              {item.label}
            </a>
          ))}

          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className={`flex items-center gap-1.5 text-sm tracking-wider uppercase transition-colors ${
              isScrolled ? 'text-foreground/80 hover:text-primary' : 'text-white/80 hover:text-white'
            }`}
            aria-label="Toggle language"
          >
            <Globe size={16} />
            {lang === 'es' ? 'IT' : 'ES'}
          </button>
        </nav>

        {/* Mobile: Lang + Menu */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={toggleLang}
            className={`text-sm tracking-wider uppercase transition-colors ${
              isScrolled ? 'text-foreground/80' : 'text-white/80'
            }`}
          >
            <Globe size={18} />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 transition-colors ${
              isScrolled ? 'text-foreground' : 'text-white'
            }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-hero/95 backdrop-blur-md border-t border-white/10"
          >
            <nav className="container mx-auto px-6 py-6 flex flex-col gap-6">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="nav-link text-white/80 py-1 text-base"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
