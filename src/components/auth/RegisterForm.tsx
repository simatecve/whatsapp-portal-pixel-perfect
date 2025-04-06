
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PersonalInfoFields from './register/PersonalInfoFields';
import PasswordFields from './register/PasswordFields';
import TermsAgreement from './register/TermsAgreement';
import SubmitButton from './register/SubmitButton';

const RegisterForm: React.FC = () => {
  // Form state
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [codigoPais, setCodigoPais] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
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

  return (
    <div className="w-full max-w-md space-y-6 p-8 bg-card rounded-xl shadow-lg animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">
          {configSistema ? "Crear una cuenta en " + configSistema.nombre_sistema : "Crear una cuenta"}
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          {configSistema?.descripcion_registro || "Comience a gestionar su API de WhatsApp"}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <PersonalInfoFields 
          nombre={nombre}
          setNombre={setNombre}
          email={email}
          setEmail={setEmail}
          empresa={empresa}
          setEmpresa={setEmpresa}
          codigoPais={codigoPais}
          setCodigoPais={setCodigoPais}
          telefono={telefono}
          setTelefono={setTelefono}
        />
        
        <PasswordFields 
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
        />
        
        <TermsAgreement 
          acceptedTerms={acceptedTerms}
          setAcceptedTerms={setAcceptedTerms}
        />

        <SubmitButton isLoading={isLoading} />
      </form>
      
      <div className="text-center text-sm">
        <p className="text-muted-foreground">
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
