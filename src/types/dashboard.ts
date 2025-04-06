
export interface DashboardStats {
  totalMessages: number;
  activeUsers: number;
  responseRate: number;
  apiUsage: number;
}

export interface DashboardMessage {
  id: number;
  mensaje: string | null;
  nombre_sesion: string | null;
  numero_whatsapp: string | null;
  pushName: string | null;
  created_at: string;
  quien_envia: string | null;
}
