
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CreateSessionModalProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  newSessionName: string;
  setNewSessionName: (name: string) => void;
  createSession: () => Promise<void>;
  isCreatingSession: boolean;
}

const CreateSessionModal: React.FC<CreateSessionModalProps> = ({
  modalOpen,
  setModalOpen,
  newSessionName,
  setNewSessionName,
  createSession,
  isCreatingSession,
}) => {
  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Conectar WhatsApp</DialogTitle>
          <DialogDescription>
            Ingrese un nombre para identificar esta conexión de WhatsApp.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="session-name">Nombre de la sesión</Label>
          <Input
            id="session-name"
            placeholder="Mi WhatsApp"
            value={newSessionName}
            onChange={(e) => setNewSessionName(e.target.value)}
            disabled={isCreatingSession}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setModalOpen(false)} disabled={isCreatingSession}>
            Cancelar
          </Button>
          <Button onClick={createSession} disabled={!newSessionName.trim() || isCreatingSession}>
            {isCreatingSession ? 'Creando...' : 'Crear sesión'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSessionModal;
