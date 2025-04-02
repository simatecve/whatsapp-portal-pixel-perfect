
import React from 'react';
import { Link } from 'react-router-dom';
import { Checkbox } from "@/components/ui/checkbox";

interface TermsAgreementProps {
  acceptedTerms: boolean;
  setAcceptedTerms: (value: boolean) => void;
}

const TermsAgreement: React.FC<TermsAgreementProps> = ({
  acceptedTerms,
  setAcceptedTerms
}) => {
  return (
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
  );
};

export default TermsAgreement;
