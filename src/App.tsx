
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import WhatsApp from "./pages/WhatsApp";
import Contactos from "./pages/Contactos";
import Grupos from "./pages/Grupos";
import Integraciones from "./pages/Integraciones";
import ApiDocs from "./pages/ApiDocs";
import Configuracion from "./pages/Configuracion";
import NotFound from "./pages/NotFound";
import AnalisisIndividual from "./pages/AnalisisIndividual";

const queryClient = new QueryClient();

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/whatsapp" element={<WhatsApp />} />
            <Route path="/contactos" element={<Contactos />} />
            <Route path="/grupos" element={<Grupos />} />
            <Route path="/integraciones" element={<Integraciones />} />
            <Route path="/api-docs" element={<ApiDocs />} />
            <Route path="/configuracion" element={<Configuracion />} />
            <Route path="/analitica/individual" element={<AnalisisIndividual />} />
            {/* AÑADE TODAS LAS RUTAS PERSONALIZADAS ARRIBA DE LA RUTA CATCH-ALL "*" */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
