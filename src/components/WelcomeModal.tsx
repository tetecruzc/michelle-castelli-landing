import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

function ElegantConfetti() {
  // Classic, elegant colors: Gold, Champagne, Burgundy, Bronze
  const colors = ['#D4AF37', '#F3E5AB', '#800020', '#CD7F32', '#FFF5EE']; 
  const pieces = Array.from({ length: 150 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100, // vw
    delay: Math.random() * 2, // staggered start
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.random() * 6 + 4, // smaller, more delicate
    duration: Math.random() * 4 + 3, // very slow, elegant fall
  }));

  return createPortal(
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -50, left: `${p.x}vw`, opacity: 0, rotate: 0 }}
          animate={{
            y: '110vh',
            left: `${p.x + (Math.random() * 10 - 5)}vw`,
            rotate: Math.random() * 360,
            opacity: [0, 1, 1, 0.8],
          }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'linear' }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '1px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        />
      ))}
    </div>,
    document.body
  );
}

export function WelcomeModal() {
  const [open, setOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const shownCount = parseInt(localStorage.getItem('welcome_modal_shown') || '0', 10);
    
    if (shownCount < 2) {
      const timer = setTimeout(() => {
        setOpen(true);
        setShowConfetti(true);
        localStorage.setItem('welcome_modal_shown', (shownCount + 1).toString());
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 10000); // 10 seconds of elegant rain
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  return (
    <>
      {showConfetti && <ElegantConfetti />}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent 
          aria-describedby={undefined} 
          className="max-w-2xl p-0 overflow-hidden bg-[#FDFBF7] shadow-2xl sm:rounded-none border-0"
        >
          <DialogTitle className="sr-only">Mensaje de bienvenida</DialogTitle>
          <DialogDescription className="sr-only">Mensaje personal de Tete para el nonno.</DialogDescription>
          
          {/* Inner Frame for classic book look */}
          <div className="m-4 border border-primary/20 p-8 sm:p-12 relative flex flex-col items-center text-center">
            
            {/* Subtle corner ornaments */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-primary/40" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-primary/40" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-primary/40" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-primary/40" />

            <span className="text-primary/60 font-display italic text-lg mb-6 tracking-widest">
              Para el nonno
            </span>

            <h2 className="text-3xl sm:text-5xl font-display text-foreground leading-tight tracking-tight mb-8">
              ¡Bienvenido a tu<br/>nueva página web!
            </h2>
            
            <div className="w-16 h-[1px] bg-primary mb-8" />

            <div className="space-y-6 text-foreground/80 leading-relaxed text-base sm:text-lg max-w-lg font-body">
              <p>
                ¡Promesa cumplida! Sé que te hice esperar un poco (y que seguro pensaste que no lo haría), pero jamás lo olvidaría.
              </p>
              <p>
                Te entrego esta nueva versión de tu página, un espacio renovado para que tus obras perduren para siempre, como sé que lo deseas.
              </p>
              <p>
                Rediseñé cada sección, restauré algunas fotos con inteligencia artificial y, sobretodo, le puse muchísimo amor.
              </p>
            </div>

            <div className="mt-12 flex flex-col items-center">
              <span className="font-display italic text-2xl text-primary mb-2">
                Con cariño, Tete <Heart className="inline h-4 w-4 fill-primary/20 ml-1" />
              </span>
            </div>

            <div className="mt-12 w-full flex justify-center">
              <button 
                onClick={() => setOpen(false)}
                className="bg-primary text-primary-foreground px-10 py-3 text-sm font-medium tracking-widest uppercase transition-all duration-300 hover:bg-primary/90 hover:shadow-lg"
              >
                Comenzar a explorar
              </button>
            </div>
            
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
