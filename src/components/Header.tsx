 import { useState, useEffect } from 'react';
 import { Menu, X } from 'lucide-react';
 import { motion, AnimatePresence } from 'framer-motion';
 
 const navItems = [
   { label: 'Inicio', href: '#inicio' },
   { label: 'Obras', href: '#obras' },
   { label: 'Sobre mí', href: '#sobre-mi' },
   { label: 'Entrevistas', href: '#entrevistas' },
   { label: 'Contacto', href: '#contacto' },
 ];
 
 export function Header() {
   const [isScrolled, setIsScrolled] = useState(false);
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 
   useEffect(() => {
     const handleScroll = () => {
       setIsScrolled(window.scrollY > 50);
     };
     window.addEventListener('scroll', handleScroll);
     return () => window.removeEventListener('scroll', handleScroll);
   }, []);
 
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
           href="#inicio" 
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
         </nav>
 
         {/* Mobile Menu Button */}
         <button
           onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
           className={`md:hidden p-2 transition-colors ${
             isScrolled ? 'text-foreground' : 'text-white'
           }`}
           aria-label="Toggle menu"
         >
           {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
         </button>
       </div>
 
       {/* Mobile Menu */}
       <AnimatePresence>
         {isMobileMenuOpen && (
           <motion.div
             initial={{ opacity: 0, height: 0 }}
             animate={{ opacity: 1, height: 'auto' }}
             exit={{ opacity: 0, height: 0 }}
             className="md:hidden bg-background border-t border-border"
           >
             <nav className="container mx-auto px-6 py-4 flex flex-col gap-4">
               {navItems.map((item) => (
                 <a
                   key={item.href}
                   href={item.href}
                   onClick={() => setIsMobileMenuOpen(false)}
                   className="nav-link text-foreground/80 py-2"
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