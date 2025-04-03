
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User as UserIcon, Key, Building, Phone } from 'lucide-react';

interface ProfileFormValues {
  nombre_completo: string;
  nombre_empresa: string;
  codigo_pais: string;
  numero_telefono: string;
  url_avatar: string;
}

interface PasswordFormValues {
  password: string;
  confirmPassword: string;
}

interface ProfileSettingsProps {
  user: User | null;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  
  const profileForm = useForm<ProfileFormValues>({
    defaultValues: {
      nombre_completo: '',
      nombre_empresa: '',
      codigo_pais: '',
      numero_telefono: '',
      url_avatar: '',
    }
  });
  
  const passwordForm = useForm<PasswordFormValues>({
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('perfiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }
        
        if (data) {
          setProfile(data);
          profileForm.reset({
            nombre_completo: data.nombre_completo || '',
            nombre_empresa: data.nombre_empresa || '',
            codigo_pais: data.codigo_pais || '',
            numero_telefono: data.numero_telefono || '',
            url_avatar: data.url_avatar || '',
          });
        }
      } catch (error) {
        console.error('Error in profile fetch:', error);
      }
    };
    
    fetchProfile();
  }, [user, profileForm]);
  
  const onSubmitProfile = async (values: ProfileFormValues) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('perfiles')
        .update({
          nombre_completo: values.nombre_completo,
          nombre_empresa: values.nombre_empresa,
          codigo_pais: values.codigo_pais,
          numero_telefono: values.numero_telefono,
          url_avatar: values.url_avatar,
          fecha_actualizacion: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Perfil actualizado",
        description: "Tu información de perfil ha sido actualizada correctamente.",
      });
      
      // Update the local profile state
      setProfile({
        ...profile,
        ...values,
        fecha_actualizacion: new Date().toISOString(),
      });
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const onSubmitPassword = async (values: PasswordFormValues) => {
    if (!user) return;
    
    if (values.password !== values.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido actualizada correctamente.",
      });
      
      passwordForm.reset({
        password: '',
        confirmPassword: '',
      });
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la contraseña: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Configuración de Perfil</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Seguridad
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card className="w-full max-w-3xl">
            <CardHeader>
              <CardTitle>Información de Perfil</CardTitle>
              <CardDescription>
                Actualiza tu información personal y de contacto
              </CardDescription>
            </CardHeader>
            
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onSubmitProfile)}>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={profileForm.control}
                        name="nombre_completo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre completo</FormLabel>
                            <FormControl>
                              <Input placeholder="Tu nombre completo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="nombre_empresa"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Empresa</FormLabel>
                            <FormControl>
                              <Input placeholder="Nombre de tu empresa" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={profileForm.control}
                        name="codigo_pais"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Código país</FormLabel>
                            <FormControl>
                              <Input placeholder="+XX" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="numero_telefono"
                        render={({ field }) => (
                          <FormItem className="col-span-1 md:col-span-2">
                            <FormLabel>Número de teléfono</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="Tu número de teléfono" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={profileForm.control}
                      name="url_avatar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL de avatar</FormLabel>
                          <FormControl>
                            <Input placeholder="https://ejemplo.com/avatar.png" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="border p-4 rounded-md bg-muted/50">
                      <FormLabel>Correo electrónico</FormLabel>
                      <div className="mt-2">
                        <Input value={user?.email || ''} disabled />
                        <FormDescription className="mt-2">
                          El correo electrónico no se puede modificar
                        </FormDescription>
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Guardando..." : "Guardar cambios"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card className="w-full max-w-3xl">
            <CardHeader>
              <CardTitle>Cambiar contraseña</CardTitle>
              <CardDescription>
                Actualiza tu contraseña para mantener tu cuenta segura
              </CardDescription>
            </CardHeader>
            
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)}>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <FormField
                      control={passwordForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nueva contraseña</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmar contraseña</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Actualizando..." : "Actualizar contraseña"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileSettings;
