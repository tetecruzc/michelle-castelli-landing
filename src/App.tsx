import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Articulos from "./pages/Articulos";
import Autor from "./pages/Autor";
import Entrevistas from "./pages/Entrevistas";
import Galeria from "./pages/Galeria";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Obras from "./pages/Obras";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {/* <WelcomeModal /> */}
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/obras" element={<Obras />} />
              <Route path="/autor" element={<Autor />} />
              <Route path="/entrevistas" element={<Entrevistas />} />
              <Route path="/articulos" element={<Articulos />} />
              <Route path="/galeria" element={<Galeria />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
