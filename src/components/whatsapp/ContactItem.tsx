
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { User2 } from 'lucide-react';

interface ContactItemProps {
  contact: {
    id: string;
    name: string;
    pushname?: string;
    isMe?: boolean;
    isGroup?: boolean;
    isBusinessAccount?: boolean;
  };
}

const ContactItem: React.FC<ContactItemProps> = ({ contact }) => {
  return (
    <TableRow key={contact.id}>
      <TableCell className="font-medium">
        <div className="flex items-center space-x-2">
          <User2 className="h-4 w-4" />
          <span>{contact.name || contact.pushname || 'Sin nombre'}</span>
          {contact.isMe && <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2">(Tú)</span>}
        </div>
      </TableCell>
      <TableCell className="text-xs text-gray-500">{contact.id}</TableCell>
      <TableCell>
        {contact.isGroup && <span className="text-xs bg-purple-100 text-purple-800 rounded-full px-2">Grupo</span>}
        {contact.isBusinessAccount && <span className="text-xs bg-green-100 text-green-800 rounded-full px-2">Negocio</span>}
        {!contact.isGroup && !contact.isBusinessAccount && !contact.isMe && 
          <span className="text-xs bg-gray-100 text-gray-800 rounded-full px-2">Personal</span>
        }
      </TableCell>
    </TableRow>
  );
};

export default ContactItem;
