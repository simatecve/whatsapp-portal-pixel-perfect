
import { useState, useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface Country {
  nombre: string;
  codigo: string;
  prefijo: string;
  bandera: string;
}

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
}

const CountrySelect = ({ value, onChange }: CountrySelectProps) => {
  const [paises, setPaises] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cargarPaises = async () => {
      try {
        setIsLoading(true);
        // Lista de países común con códigos ISO, prefijos telefónicos y emojis de banderas
        const listaPaises: Country[] = [
          { nombre: "Argentina", codigo: "AR", prefijo: "+54", bandera: "🇦🇷" },
          { nombre: "Bolivia", codigo: "BO", prefijo: "+591", bandera: "🇧🇴" },
          { nombre: "Brasil", codigo: "BR", prefijo: "+55", bandera: "🇧🇷" },
          { nombre: "Chile", codigo: "CL", prefijo: "+56", bandera: "🇨🇱" },
          { nombre: "Colombia", codigo: "CO", prefijo: "+57", bandera: "🇨🇴" },
          { nombre: "Costa Rica", codigo: "CR", prefijo: "+506", bandera: "🇨🇷" },
          { nombre: "Cuba", codigo: "CU", prefijo: "+53", bandera: "🇨🇺" },
          { nombre: "Ecuador", codigo: "EC", prefijo: "+593", bandera: "🇪🇨" },
          { nombre: "El Salvador", codigo: "SV", prefijo: "+503", bandera: "🇸🇻" },
          { nombre: "España", codigo: "ES", prefijo: "+34", bandera: "🇪🇸" },
          { nombre: "Estados Unidos", codigo: "US", prefijo: "+1", bandera: "🇺🇸" },
          { nombre: "Guatemala", codigo: "GT", prefijo: "+502", bandera: "🇬🇹" },
          { nombre: "Honduras", codigo: "HN", prefijo: "+504", bandera: "🇭🇳" },
          { nombre: "México", codigo: "MX", prefijo: "+52", bandera: "🇲🇽" },
          { nombre: "Nicaragua", codigo: "NI", prefijo: "+505", bandera: "🇳🇮" },
          { nombre: "Panamá", codigo: "PA", prefijo: "+507", bandera: "🇵🇦" },
          { nombre: "Paraguay", codigo: "PY", prefijo: "+595", bandera: "🇵🇾" },
          { nombre: "Perú", codigo: "PE", prefijo: "+51", bandera: "🇵🇪" },
          { nombre: "Puerto Rico", codigo: "PR", prefijo: "+1", bandera: "🇵🇷" },
          { nombre: "República Dominicana", codigo: "DO", prefijo: "+1", bandera: "🇩🇴" },
          { nombre: "Uruguay", codigo: "UY", prefijo: "+598", bandera: "🇺🇾" },
          { nombre: "Venezuela", codigo: "VE", prefijo: "+58", bandera: "🇻🇪" },
          // Añadiendo más países de otras regiones
          { nombre: "Alemania", codigo: "DE", prefijo: "+49", bandera: "🇩🇪" },
          { nombre: "Francia", codigo: "FR", prefijo: "+33", bandera: "🇫🇷" },
          { nombre: "Italia", codigo: "IT", prefijo: "+39", bandera: "🇮🇹" },
          { nombre: "Reino Unido", codigo: "GB", prefijo: "+44", bandera: "🇬🇧" },
          { nombre: "Japón", codigo: "JP", prefijo: "+81", bandera: "🇯🇵" },
          { nombre: "China", codigo: "CN", prefijo: "+86", bandera: "🇨🇳" },
          { nombre: "India", codigo: "IN", prefijo: "+91", bandera: "🇮🇳" },
          { nombre: "Australia", codigo: "AU", prefijo: "+61", bandera: "🇦🇺" },
          { nombre: "Canadá", codigo: "CA", prefijo: "+1", bandera: "🇨🇦" },
          { nombre: "Sudáfrica", codigo: "ZA", prefijo: "+27", bandera: "🇿🇦" }
        ];
        
        // Ordenar países por nombre
        const paisesOrdenados = listaPaises.sort((a, b) => 
          a.nombre.localeCompare(b.nombre, 'es')
        );
        
        setPaises(paisesOrdenados);
        
        // Si no hay valor seleccionado, establecer España como predeterminado
        if (!value && paisesOrdenados.length > 0) {
          const defaultCountry = paisesOrdenados.find(p => p.codigo === 'ES');
          if (defaultCountry) {
            onChange(defaultCountry.codigo);
          }
        }
      } catch (error) {
        console.error('Error al cargar países:', error);
      } finally {
        setIsLoading(false);
      }
    };

    cargarPaises();
  }, []);

  const selectedCountry = paises.find(p => p.codigo === value);

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={isLoading}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Seleccionar país">
          {selectedCountry ? (
            <div className="flex items-center">
              <span className="mr-2 text-lg">{selectedCountry.bandera}</span>
              <span>{selectedCountry.nombre}</span>
              <span className="ml-2 text-gray-500">{selectedCountry.prefijo}</span>
            </div>
          ) : (
            "Seleccionar país"
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {paises.map((pais) => (
          <SelectItem key={pais.codigo} value={pais.codigo}>
            <div className="flex items-center">
              <span className="mr-2 text-lg">{pais.bandera}</span>
              <span>{pais.nombre}</span>
              <span className="ml-2 text-gray-500">{pais.prefijo}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CountrySelect;
