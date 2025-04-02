
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const StatsPanel: React.FC = () => {
  return (
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
  );
};

export default StatsPanel;
