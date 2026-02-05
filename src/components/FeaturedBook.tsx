 import { motion } from 'framer-motion';
 import bookDiaspora from '@/assets/book-diaspora.jpg';
 import { Star } from 'lucide-react';
 
 export function FeaturedBook() {
   return (
     <section id="obras" className="py-24 bg-background">
       <div className="container mx-auto px-6">
         {/* Section Header */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
           className="text-center mb-16"
         >
           <span className="inline-block bg-primary text-primary-foreground px-6 py-2 text-sm tracking-widest uppercase mb-6">
             Publicación Reciente
           </span>
           <h2 className="font-display text-4xl md:text-6xl text-foreground tracking-wide mb-4">
             DIÁSPORA
           </h2>
           <p className="text-xl text-muted-foreground font-display italic">
             Cuentos de Emigración
           </p>
         </motion.div>
 
         <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-16">
           Una conmovedora historia sobre la inmigración italiana a Venezuela en 
           los años '50. Disponible en español y portugués.
         </p>
 
         {/* Book Cards */}
         <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
           {/* Spanish Version */}
           <motion.div
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
             className="bg-card rounded-lg shadow-lg p-6 flex gap-6"
           >
             <img
               src={bookDiaspora}
               alt="Diáspora - Versión en Español"
               className="w-36 h-auto rounded shadow-md flex-shrink-0 object-cover"
             />
             <div className="flex flex-col">
               <h3 className="font-display text-xl mb-1">Versión en Español</h3>
               <p className="text-sm text-muted-foreground mb-3">Historias de Inmigración</p>
               
               <div className="flex gap-0.5 mb-4">
                 {[...Array(5)].map((_, i) => (
                   <Star key={i} size={16} className="fill-primary text-primary" />
                 ))}
               </div>
 
               <p className="text-sm text-muted-foreground mb-6 flex-grow line-clamp-4">
                 Tres relatos que reflejan el impacto de la inmigración italiana en Venezuela, 
                 entre sueños, sacrificios y legado.
               </p>
 
               <a
                 href="https://amazon.com"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="btn-primary text-center"
               >
                 Comprar en Amazon
               </a>
               <p className="text-xs text-muted-foreground italic mt-2 text-center">
                 Disponible en formato digital y físico
               </p>
             </div>
           </motion.div>
 
           {/* Portuguese Version */}
           <motion.div
             initial={{ opacity: 0, x: 30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
             className="bg-card rounded-lg shadow-lg p-6 flex gap-6"
           >
             <img
               src={bookDiaspora}
               alt="Diáspora - Versão em Português"
               className="w-36 h-auto rounded shadow-md flex-shrink-0 object-cover"
             />
             <div className="flex flex-col">
               <h3 className="font-display text-xl mb-1">Versão em Português</h3>
               <p className="text-sm text-muted-foreground mb-3">Racconti di emigrazione</p>
               
               <div className="flex gap-0.5 mb-4">
                 {[...Array(5)].map((_, i) => (
                   <Star key={i} size={16} className="fill-primary text-primary" />
                 ))}
               </div>
 
               <p className="text-sm text-muted-foreground mb-6 flex-grow line-clamp-4">
                 Três relatos que refletem o impacto da imigração italiana na Venezuela, 
                 entre sonhos, sacrifícios e legado.
               </p>
 
               <a
                 href="https://amazon.com"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="btn-primary text-center"
               >
                 Comprar na Amazon
               </a>
               <p className="text-xs text-muted-foreground italic mt-2 text-center">
                 Disponível em formato digital e físico
               </p>
             </div>
           </motion.div>
         </div>
       </div>
     </section>
   );
 }