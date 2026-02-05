 import { motion } from 'framer-motion';
 import heroBg from '@/assets/hero-bg.jpg';
 
 export function Hero() {
   return (
     <section
       id="inicio"
       className="relative min-h-screen flex items-center justify-start overflow-hidden"
     >
       {/* Background Image */}
       <div
         className="absolute inset-0 bg-cover bg-center bg-no-repeat"
         style={{ backgroundImage: `url(${heroBg})` }}
       >
         <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
       </div>
 
       {/* Content */}
       <div className="relative container mx-auto px-6 py-32">
         <motion.div
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, delay: 0.3 }}
           className="max-w-2xl"
         >
           <h1 className="font-display text-5xl md:text-7xl text-white tracking-wider mb-6">
             Michele Castelli
           </h1>
           
           <div className="flex items-center gap-4 mb-8">
             <span className="w-12 h-px bg-white/60" />
             <p className="text-white/80 tracking-widest uppercase text-sm">
               Venezuela
             </p>
             <span className="w-12 h-px bg-white/60" />
           </div>
 
           <p className="text-white/70 text-lg mb-10 leading-relaxed max-w-lg font-light">
             Escritor, lingüista y académico. Explorando la diáspora italiana 
             y las raíces culturales a través de la palabra escrita.
           </p>
 
           <a href="#contacto" className="btn-hero inline-block">
             Contáctame
           </a>
         </motion.div>
       </div>
 
       {/* Scroll Indicator */}
       <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ delay: 1.5 }}
         className="absolute bottom-10 left-1/2 -translate-x-1/2"
       >
         <div className="flex flex-col items-center gap-2">
           <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/50 to-white/20" />
         </div>
       </motion.div>
     </section>
   );
 }