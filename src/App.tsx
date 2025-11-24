import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import { CookieBanner } from "@/components/CookieBanner";
import { useNavigate, useLocation } from "react-router-dom";
import { useYandexMetrika } from "@/hooks/useYandexMetrika";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Oferta from "./pages/Oferta";
import Admin from "./pages/Admin";
import AdminContent from "./pages/AdminContent";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component that uses auth context - must be inside AuthProvider
const AppContent = () => {
  const { isAuthModalOpen, authModalMode, closeAuthModal } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Инициализация и отслеживание Яндекс.Метрики
  useYandexMetrika(location.pathname);
  
  const handleAuthSuccess = () => {
    navigate('/trainer');
  };
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/trainer" element={<Index />} />
        <Route path="/oferta" element={<Oferta />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/content" element={<AdminContent />} />
        {/* Payment page placeholder - will be implemented */}
        <Route path="/payment" element={<div className="flex items-center justify-center min-h-screen bg-[#0B0C10] text-white text-2xl">Страница оплаты (в разработке)</div>} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={closeAuthModal} 
        onSuccess={handleAuthSuccess} 
        initialMode={authModalMode}
      />
      
      <CookieBanner />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
