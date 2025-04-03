
import React from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import ContactItem from './ContactItem';

interface WhatsAppContact {
  id: string;
  name: string;
  pushname?: string;
  isMe?: boolean;
  isGroup?: boolean;
  isBusinessAccount?: boolean;
}

interface ContactsTableProps {
  contacts: WhatsAppContact[];
}

const ContactsTable: React.FC<ContactsTableProps> = ({ contacts }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>ID</TableHead>
          <TableHead>Tipo</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map((contact) => (
          <ContactItem key={contact.id} contact={contact} />
        ))}
      </TableBody>
    </Table>
  );
};

export default ContactsTable;
