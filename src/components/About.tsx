 import { motion } from 'framer-motion';
 import authorPortrait from '@/assets/author-portrait.jpg';
 
 const bioSections = [
   {
     text: `Profesor de lingüística y dialectología comparada (italiano-español) en la Facultad de Humanidades y Educación de la Universidad Central de Venezuela desde 1972, se especializa luego en Fonética y fonología, y se inicia en el estudio del Método Verbo-Tonal para la rehabilitación de los sordomudos, bajo la dirección de su fundador Petar Guberina.`,
   },
   {
     text: `Fue fundador del Departamento de Italiano y del Instituto de Investigaciones Lingüísticas (Unidad de Investigación) y luego en 1985 de Núcleo, revista científica de la Escuela de Idiomas Modernos de la cual fue Director hasta 1996. De 1990 a 1996 se desempeñó también como Director de la Escuela.`,
   },
   {
     text: `Actualmente Michele Castelli, además de estudiar y difundir poetas y escritores dialectales de su país de origen, continúa con sus estudios de investigación sociolingüística en relación con los comportamientos lingüísticos de las segundas y terceras generaciones de italianos en Venezuela.`,
   },
 ];
 
 export function About() {
   return (
     <section id="sobre-mi" className="py-24 bg-section-alt">
       <div className="container mx-auto px-6">
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-16"
         >
           <span className="text-sm tracking-widest uppercase text-muted-foreground mb-4 block">
             Sobre él
           </span>
           <h2 className="font-display text-3xl md:text-5xl text-primary mb-4">
             Nace en Santa Croce di Magliano, Italia
           </h2>
           <p className="text-muted-foreground max-w-3xl mx-auto">
             El 3 de Julio de 1946, de Giuseppe Castelli y María Morgante. Se gradúa en la 
             Universidad de Bari en Idiomas Modernos y en 1970 regresa a Venezuela donde 
             había llegado la primera vez en 1957 junto con sus hermanos Nina y Giovanni 
             para reunirse con sus padres emigrados a este país en el lejano 1950.
           </p>
         </motion.div>
 
         <div className="grid lg:grid-cols-2 gap-16 items-start max-w-6xl mx-auto">
           {/* Photo with frame */}
           <motion.div
             initial={{ opacity: 0, x: -40 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="relative mx-auto lg:mx-0"
           >
             <div className="photo-frame inline-block">
               <img
                 src={authorPortrait}
                 alt="Michele Castelli"
                 className="w-full max-w-md rounded shadow-2xl grayscale"
               />
             </div>
           </motion.div>
 
           {/* Bio text blocks */}
           <div className="space-y-8">
             {bioSections.map((section, index) => (
               <motion.div
                 key={index}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.6, delay: index * 0.2 }}
               >
                 {index === 0 && (
                   <div className="flex items-center gap-4 mb-6">
                     <span className="w-12 h-px bg-primary" />
                     <span className="quote-mark text-5xl font-display">"</span>
                     <span className="w-12 h-px bg-primary" />
                   </div>
                 )}
                 <p className="text-muted-foreground leading-relaxed text-center lg:text-left">
                   {section.text}
                 </p>
               </motion.div>
             ))}
           </div>
         </div>
       </div>
     </section>
   );
 }