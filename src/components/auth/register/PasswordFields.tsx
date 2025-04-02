
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Lock, Eye, EyeOff } from "lucide-react";

interface PasswordFieldsProps {
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
}

const PasswordFields: React.FC<PasswordFieldsProps> = ({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleShowPassword = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <>
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
    </>
  );
};

export default PasswordFields;
