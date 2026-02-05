 import { Facebook, Twitter, Mail } from 'lucide-react';
 
 export function Footer() {
   return (
     <footer className="bg-hero py-12">
       <div className="container mx-auto px-6">
         {/* Social Links */}
         <div className="flex flex-wrap justify-center items-center gap-8 mb-8">
           <a
             href="https://facebook.com/castelliMika"
             target="_blank"
             rel="noopener noreferrer"
             className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
           >
             <Facebook size={20} />
             <span className="text-sm">castelliMika</span>
           </a>
 
           <a
             href="mailto:castellimika@yahoo.es"
             className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
           >
             <Mail size={20} />
             <span className="text-sm">castellimika@yahoo.es</span>
           </a>
 
           <a
             href="https://twitter.com/castelliMika"
             target="_blank"
             rel="noopener noreferrer"
             className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
           >
             <Twitter size={20} />
             <span className="text-sm">castelliMika</span>
           </a>
         </div>
 
         {/* Divider */}
         <div className="w-full max-w-4xl mx-auto h-px bg-white/20 mb-8" />
 
         {/* Copyright */}
         <p className="text-center text-white/50 text-sm italic">
           © Michele Castelli {new Date().getFullYear()}
         </p>
       </div>
     </footer>
   );
 }