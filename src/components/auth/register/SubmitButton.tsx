
import React from 'react';
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  isLoading: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading }) => {
  return (
    <Button 
      type="submit" 
      className="w-full bg-whatsapp hover:bg-whatsapp-dark font-medium"
      disabled={isLoading}
    >
      {isLoading ? "Creando Cuenta..." : "Crear Cuenta"}
    </Button>
  );
};

export default SubmitButton;
