import { PlusCircleIcon, XCircleIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export type ContactInfoItem = {
  name: string;
  phone: string;
};

export type SalesContactInputProps = {
  contacts: ContactInfoItem[];
  onContactsChange: (contacts: ContactInfoItem[]) => void;
  errors?:
    | Array<{
        name?: string;
        phone?: string;
      }>
    | string;
};

export function SalesContactInput({ contacts, onContactsChange, errors }: SalesContactInputProps) {
  const getError = (index: number, field: 'name' | 'phone') => {
    if (!errors) return null;

    if (Array.isArray(errors) && errors[index]) {
      return errors[index][field];
    }

    if (typeof errors === 'string') {
      return errors;
    }

    return null;
  };
  const handleContactChange = (index: number, field: keyof ContactInfoItem, value: string) => {
    const updatedContacts = [...contacts];
    updatedContacts[index] = {
      ...updatedContacts[index],
      [field]: value,
    };
    onContactsChange(updatedContacts);
  };

  const addContact = () => {
    onContactsChange([...contacts, { name: '', phone: '' }]);
  };

  const removeContact = (index: number) => {
    const updatedContacts = contacts.filter((_, i) => i !== index);
    onContactsChange(updatedContacts);
  };

  return (
    <div className="space-y-4">
      {contacts.map((contact, index) => {
        const nameError = getError(index, 'name');
        const phoneError = getError(index, 'phone');

        return (
          <div key={index} className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="w-1/2 space-y-1">
                <Input
                  placeholder="Nama"
                  value={contact.name}
                  maxLength={128}
                  onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                  className={cn({
                    'border-destructive focus-visible:ring-destructive': nameError,
                  })}
                  aria-invalid={!!nameError}
                />
                {nameError && <p className="text-sm font-medium text-destructive">{nameError}</p>}
              </div>
              <div className="w-1/2 space-y-1">
                <Input
                  placeholder="Nomor Telepon"
                  value={contact.phone}
                  onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
                  maxLength={20}
                  className={cn({
                    'border-destructive focus-visible:ring-destructive': phoneError,
                  })}
                  aria-invalid={!!phoneError}
                />
                {phoneError && <p className="text-sm font-medium text-destructive">{phoneError}</p>}
              </div>
              {contacts.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer h-9 w-9 mt-1"
                  onClick={() => removeContact(index)}
                  type="button"
                  aria-label="Hapus kontak"
                >
                  <XCircleIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        );
      })}
      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer text-primary hover:text-primary/80"
          onClick={addContact}
          type="button"
          aria-label="Tambah kontak"
        >
          <PlusCircleIcon size={20} />
        </Button>
      </div>
    </div>
  );
}
