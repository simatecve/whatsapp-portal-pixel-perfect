
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const QuickActions: React.FC = () => {
  return (
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
  );
};

export default QuickActions;
