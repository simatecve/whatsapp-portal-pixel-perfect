
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarRail,
  SidebarInset
} from '@/components/ui/sidebar';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { 
  Home, MessageSquare, Settings, Users, BarChart2, 
  LogOut, Mail, HelpCircle, BellRing
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [systemConfig, setSystemConfig] = useState<any>(null);
  
  // En el futuro, esto estaría conectado a la autenticación de Supabase
  const isAuthenticated = true; // Placeholder para verificación de autenticación
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    
    // Obtener datos del usuario actual y configuración del sistema
    const fetchData = async () => {
      try {
        // Obtener usuario
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          // Obtener perfil del usuario
          const { data: profileData } = await supabase
            .from('perfiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
          
          setProfile(profileData);
        }
        
        // Obtener configuración del sistema
        const { data: configData } = await supabase
          .from('configuracion_sistema')
          .select('*')
          .maybeSingle();
          
        setSystemConfig(configData);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-gray-50">
        {/* Sidebar */}
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center p-2">
              <svg className="w-8 h-8 text-whatsapp" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" />
                <path d="M12 6L11.06 11.06L6 12L11.06 12.94L12 18L12.94 12.94L18 12L12.94 11.06L12 6Z" />
              </svg>
              <span className="ml-2 text-xl font-bold">
                {systemConfig?.nombre_sistema || 'WhatsAPI'}
              </span>
            </div>
            
            {/* Información del usuario */}
            {profile && (
              <div className="px-3 py-2">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-whatsapp-light text-whatsapp-dark flex items-center justify-center text-sm font-medium">
                    {profile.nombre_completo ? profile.nombre_completo.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{profile.nombre_completo || 'Usuario'}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    {profile.nombre_empresa && (
                      <p className="text-xs text-muted-foreground">{profile.nombre_empresa}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Inicio">
                  <Home className="h-5 w-5" />
                  <span>Inicio</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Mensajes">
                  <MessageSquare className="h-5 w-5" />
                  <span>Mensajes</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Contactos">
                  <Users className="h-5 w-5" />
                  <span>Contactos</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Analítica">
                  <BarChart2 className="h-5 w-5" />
                  <span>Analítica</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Configuración">
                  <Settings className="h-5 w-5" />
                  <span>Configuración</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Ayuda">
                  <HelpCircle className="h-5 w-5" />
                  <span>Ayuda</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip="Cerrar sesión">
                  <LogOut className="h-5 w-5" />
                  <span>Cerrar sesión</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          
          <SidebarRail />
        </Sidebar>
        
        {/* Main Content */}
        <SidebarInset>
          {/* Navbar */}
          <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <SidebarTrigger className="mr-2" />
                  <span className="text-xl font-semibold">
                    {systemConfig ? `Panel de Control - ${systemConfig.nombre_sistema}` : 'Panel de Control'}
                  </span>
                </div>
                <div className="flex items-center">
                  <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none">
                    <BellRing className="h-6 w-6" />
                    <span className="sr-only">Notificaciones</span>
                  </button>
                  <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none ml-2">
                    <Mail className="h-6 w-6" />
                    <span className="sr-only">Mensajes</span>
                  </button>
                </div>
              </div>
            </div>
          </nav>
          
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {/* Dashboard Header */}
            <div className="px-4 py-6 sm:px-0">
              <h1 className="text-2xl font-semibold text-gray-900">Panel de Control</h1>
              <p className="mt-1 text-sm text-gray-500">
                Bienvenido a su panel de administración de {systemConfig?.nombre_sistema || 'WhatsAPI'}.
              </p>
            </div>
            
            {/* Stats */}
            <div className="mt-4 px-4 sm:px-0">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {/* Stat 1 */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Total Mensajes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">1.248</div>
                    <p className="text-xs text-green-500 flex items-center mt-1">
                      <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none">
                        <path d="M3 9L6 6L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6 6V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      +12,5% desde el mes pasado
                    </p>
                  </CardContent>
                </Card>
                
                {/* Stat 2 */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Usuarios Activos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">843</div>
                    <p className="text-xs text-green-500 flex items-center mt-1">
                      <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none">
                        <path d="M3 9L6 6L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6 6V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      +8,2% desde el mes pasado
                    </p>
                  </CardContent>
                </Card>
                
                {/* Stat 3 */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Tasa de Respuesta</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">92%</div>
                    <p className="text-xs text-red-500 flex items-center mt-1">
                      <svg className="w-3 h-3 mr-1 transform rotate-180" viewBox="0 0 12 12" fill="none">
                        <path d="M3 9L6 6L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6 6V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      -2,3% desde el mes pasado
                    </p>
                  </CardContent>
                </Card>
                
                {/* Stat 4 */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Uso de API</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">64%</div>
                    <p className="text-xs text-gray-500 mt-1">
                      del cupo mensual
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="mt-8 px-4 sm:px-0">
              <h2 className="text-lg font-medium text-gray-900">Actividad Reciente</h2>
              <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <li key={item}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-whatsapp truncate">
                            Nuevo mensaje recibido del Usuario #{item}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Entregado
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                              Juan Pérez
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            <p>
                              <time dateTime="2020-01-07">7 de Enero, 2020</time>
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="mt-8 px-4 sm:px-0">
              <h2 className="text-lg font-medium text-gray-900">Acciones Rápidas</h2>
              <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Enviar Mensaje</CardTitle>
                    <CardDescription>Envíe un mensaje a sus clientes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="bg-whatsapp hover:bg-whatsapp-dark w-full">Redactar Mensaje</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Crear Plantilla</CardTitle>
                    <CardDescription>Cree una nueva plantilla de mensaje</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="bg-whatsapp hover:bg-whatsapp-dark w-full">Nueva Plantilla</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Ver Analíticas</CardTitle>
                    <CardDescription>Revise el rendimiento de sus mensajes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="bg-whatsapp hover:bg-whatsapp-dark w-full">Ver Informes</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
