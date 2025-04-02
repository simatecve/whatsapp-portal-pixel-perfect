
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { User, Mail, Building, Phone } from "lucide-react";
import CountrySelect from '../CountrySelect';

interface PersonalInfoFieldsProps {
  nombre: string;
  setNombre: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  empresa: string;
  setEmpresa: (value: string) => void;
  codigoPais: string;
  setCodigoPais: (value: string) => void;
  telefono: string;
  setTelefono: (value: string) => void;
}

const PersonalInfoFields: React.FC<PersonalInfoFieldsProps> = ({
  nombre,
  setNombre,
  email,
  setEmail,
  empresa,
  setEmpresa,
  codigoPais,
  setCodigoPais,
  telefono,
  setTelefono
}) => {
  return (
    <>
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
    </>
  );
};

export default PersonalInfoFields;
