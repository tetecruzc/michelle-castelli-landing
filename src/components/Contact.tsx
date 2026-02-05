 import { motion } from 'framer-motion';
 import { User, Mail, MessageSquare } from 'lucide-react';
 import { useState } from 'react';
 import contactBg from '@/assets/contact-bg.jpg';
 
 export function Contact() {
   const [formData, setFormData] = useState({
     name: '',
     email: '',
     message: '',
   });
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     // Handle form submission
     console.log('Form submitted:', formData);
   };
 
   return (
     <section id="contacto" className="relative py-24 overflow-hidden">
       {/* Background */}
       <div className="absolute inset-0">
         <div
           className="absolute inset-0 bg-cover bg-center"
           style={{ backgroundImage: `url(${contactBg})` }}
         />
         <div className="absolute inset-0 bg-hero/80" />
       </div>
 
       <div className="container mx-auto px-6 relative z-10">
         <div className="max-w-4xl mx-auto">
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="bg-gradient-to-br from-hero/90 to-hero/70 backdrop-blur-sm rounded-lg p-8 md:p-12 shadow-2xl"
           >
             <h2 className="font-display text-3xl md:text-4xl text-primary mb-8">
               Envíame un mensaje
             </h2>
 
             <form onSubmit={handleSubmit} className="space-y-6">
               {/* Name Field */}
               <div className="relative">
                 <User className="absolute left-0 top-3 text-white/50" size={20} />
                 <input
                   type="text"
                   placeholder="Su nombre"
                   value={formData.name}
                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                   className="w-full bg-transparent border-b border-white/30 pl-8 py-3 text-white placeholder:text-white/50 focus:outline-none focus:border-primary transition-colors"
                   required
                 />
               </div>
 
               {/* Email Field */}
               <div className="relative">
                 <Mail className="absolute left-0 top-3 text-white/50" size={20} />
                 <input
                   type="email"
                   placeholder="Email"
                   value={formData.email}
                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                   className="w-full bg-transparent border-b border-white/30 pl-8 py-3 text-white placeholder:text-white/50 focus:outline-none focus:border-primary transition-colors"
                   required
                 />
               </div>
 
               {/* Message Field */}
               <div className="relative">
                 <MessageSquare className="absolute left-0 top-3 text-white/50" size={20} />
                 <textarea
                   placeholder="Su mensaje"
                   value={formData.message}
                   onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                   rows={4}
                   className="w-full bg-transparent border-b border-white/30 pl-8 py-3 text-white placeholder:text-white/50 focus:outline-none focus:border-primary transition-colors resize-none"
                   required
                 />
               </div>
 
               <button
                 type="submit"
                 className="btn-primary mt-4"
               >
                 Enviar Mensaje
               </button>
             </form>
           </motion.div>
         </div>
       </div>
     </section>
   );
 }