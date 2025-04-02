
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, User, Eye, EyeOff, Building, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import CountrySelect from './CountrySelect';

const RegisterForm: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [codigoPais, setCodigoPais] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [configSistema, setConfigSistema] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Cargar configuración del sistema desde la base de datos
  useEffect(() => {
    const cargarConfiguracion = async () => {
      try {
        const { data, error } = await supabase
          .from('configuracion_sistema')
          .select('*')
          .single();
        
        if (error) throw error;
        
        if (data) {
          setConfigSistema(data);
        }
      } catch (error) {
        console.error("Error al cargar configuración:", error);
      }
    };
    
    cargarConfiguracion();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar contraseñas
    if (password !== confirmPassword) {
      toast({
        title: "Las contraseñas no coinciden",
        description: "Por favor, asegúrate de que tus contraseñas coinciden.",
        variant: "destructive",
      });
      return;
    }
    
    if (!acceptedTerms) {
      toast({
        title: "Términos y condiciones",
        description: "Por favor, acepta los términos y condiciones para continuar.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    // Obtener el prefijo telefónico según el código de país
    const getPrefijo = () => {
      const paises = [
        { codigo: "AR", prefijo: "+54" }, { codigo: "BO", prefijo: "+591" }, 
        { codigo: "BR", prefijo: "+55" }, { codigo: "CL", prefijo: "+56" }, 
        { codigo: "CO", prefijo: "+57" }, { codigo: "CR", prefijo: "+506" },
        { codigo: "CU", prefijo: "+53" }, { codigo: "EC", prefijo: "+593" },
        { codigo: "SV", prefijo: "+503" }, { codigo: "ES", prefijo: "+34" },
        { codigo: "US", prefijo: "+1" }, { codigo: "GT", prefijo: "+502" },
        { codigo: "HN", prefijo: "+504" }, { codigo: "MX", prefijo: "+52" },
        { codigo: "NI", prefijo: "+505" }, { codigo: "PA", prefijo: "+507" },
        { codigo: "PY", prefijo: "+595" }, { codigo: "PE", prefijo: "+51" },
        { codigo: "PR", prefijo: "+1" }, { codigo: "DO", prefijo: "+1" },
        { codigo: "UY", prefijo: "+598" }, { codigo: "VE", prefijo: "+58" },
        { codigo: "DE", prefijo: "+49" }, { codigo: "FR", prefijo: "+33" },
        { codigo: "IT", prefijo: "+39" }, { codigo: "GB", prefijo: "+44" },
        { codigo: "JP", prefijo: "+81" }, { codigo: "CN", prefijo: "+86" },
        { codigo: "IN", prefijo: "+91" }, { codigo: "AU", prefijo: "+61" },
        { codigo: "CA", prefijo: "+1" }, { codigo: "ZA", prefijo: "+27" }
      ];
      return paises.find(p => p.codigo === codigoPais)?.prefijo || "";
    };

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre_completo: nombre,
            nombre_empresa: empresa,
            codigo_pais: codigoPais,
            numero_telefono: telefono
          }
        }
      });

      if (error) {
        throw error;
      }

      // También actualizamos directamente la tabla de perfiles para asegurarnos
      // que se guardan todos los campos (por si el trigger no funciona correctamente)
      if (data.user) {
        await supabase
          .from('perfiles')
          .upsert({
            id: data.user.id,
            nombre_completo: nombre,
            nombre_empresa: empresa,
            codigo_pais: codigoPais,
            numero_telefono: telefono
          });
      }

      toast({
        title: "¡Cuenta creada!",
        description: "Tu cuenta ha sido creada exitosamente.",
      });
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Error de registro:", error);
      toast({
        title: "Error de registro",
        description: error.message || "Hubo un error al crear tu cuenta. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 p-8 bg-white rounded-xl shadow-lg animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {configSistema ? "Crear una cuenta en " + configSistema.nombre_sistema : "Crear una cuenta"}
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          {configSistema?.descripcion_registro || "Comience a gestionar su API de WhatsApp"}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="nombre" className="text-sm font-medium">Nombre Completo</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <Input 
              id="nombre" 
              type="text" 
              placeholder="Juan Pérez" 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">Correo Electrónico</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <Input 
              id="email" 
              type="email" 
              placeholder="nombre@empresa.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="empresa" className="text-sm font-medium">Nombre de Empresa</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building className="h-5 w-5 text-gray-400" />
            </div>
            <Input 
              id="empresa" 
              type="text" 
              placeholder="Mi Empresa S.A." 
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        {/* Nuevo campo para número de teléfono con selector de país */}
        <div className="space-y-2">
          <Label htmlFor="telefono" className="text-sm font-medium">Número de Teléfono</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="md:col-span-1">
              <CountrySelect 
                value={codigoPais}
                onChange={setCodigoPais}
              />
            </div>
            <div className="md:col-span-2 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <Input 
                id="telefono" 
                type="tel" 
                placeholder="612345678" 
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">Contraseña</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <Input 
              id="password" 
              type={showPassword ? 'text' : 'password'} 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              required
            />
            <button 
              type="button"
              onClick={() => toggleShowPassword('password')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? 
                <EyeOff className="h-5 w-5 text-gray-400" /> : 
                <Eye className="h-5 w-5 text-gray-400" />
              }
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar Contraseña</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <Input 
              id="confirmPassword" 
              type={showConfirmPassword ? 'text' : 'password'} 
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10"
              required
            />
            <button 
              type="button"
              onClick={() => toggleShowPassword('confirmPassword')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? 
                <EyeOff className="h-5 w-5 text-gray-400" /> : 
                <Eye className="h-5 w-5 text-gray-400" />
              }
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="terms" 
            checked={acceptedTerms}
            onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
          />
          <label
            htmlFor="terms"
            className="text-sm text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Acepto los{" "}
            <Link to="/terms" className="text-whatsapp hover:underline">
              Términos de Servicio
            </Link>
            {" "}y la{" "}
            <Link to="/privacy" className="text-whatsapp hover:underline">
              Política de Privacidad
            </Link>
          </label>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-whatsapp hover:bg-whatsapp-dark font-medium"
          disabled={isLoading}
        >
          {isLoading ? "Creando Cuenta..." : "Crear Cuenta"}
        </Button>
      </form>
      
      <div className="text-center text-sm">
        <p className="text-gray-500">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="text-whatsapp font-medium hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
