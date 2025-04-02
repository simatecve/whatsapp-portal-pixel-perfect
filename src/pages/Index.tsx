
import { Button } from "@/components/ui/button";
import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function Index() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Comprobar si hay una sesión activa
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Escuchar cambios en el estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Redirigir al dashboard si el usuario está autenticado
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  // Redirigir directamente a la página de login
  return <Navigate to="/login" replace />;
}
