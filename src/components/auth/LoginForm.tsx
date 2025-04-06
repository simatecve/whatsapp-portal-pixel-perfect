
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/dashboard');
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      console.log("Login successful, session:", data.session);
      
      if (data.session) {
        toast({
          title: "¡Éxito!",
          description: "Has iniciado sesión correctamente.",
        });
        navigate('/dashboard');
      } else {
        throw new Error("No se pudo iniciar sesión. No se creó la sesión.");
      }
    } catch (error: any) {
      console.error("Error de inicio de sesión:", error);
      toast({
        title: "Error de inicio de sesión",
        description: error.message || "Por favor, verifica tus credenciales e intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full max-w-md space-y-6 p-8 bg-card rounded-xl shadow-lg animate-fade-in dark:bg-gray-800">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground dark:text-white">Bienvenido de nuevo</h2>
        <p className="text-sm text-muted-foreground mt-2 dark:text-gray-300">Accede a tu panel de WhatsAPI</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium dark:text-gray-200">Correo electrónico</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-muted-foreground dark:text-gray-400" />
            </div>
            <Input 
              id="email" 
              type="email" 
              placeholder="nombre@empresa.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium dark:text-gray-200">Contraseña</Label>
            <Link to="/forgot-password" className="text-xs text-whatsapp hover:underline dark:text-green-400">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-muted-foreground dark:text-gray-400" />
            </div>
            <Input 
              id="password" 
              type={showPassword ? 'text' : 'password'} 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
            <button 
              type="button"
              onClick={toggleShowPassword}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? 
                <EyeOff className="h-5 w-5 text-muted-foreground dark:text-gray-400" /> : 
                <Eye className="h-5 w-5 text-muted-foreground dark:text-gray-400" />
              }
            </button>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-whatsapp hover:bg-whatsapp-dark font-medium"
          disabled={isLoading}
        >
          {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
        </Button>
      </form>
      
      <div className="text-center text-sm">
        <p className="text-muted-foreground dark:text-gray-300">
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="text-whatsapp font-medium hover:underline dark:text-green-400">
            Crear cuenta
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
