export interface Contact {
  id: string;
  name: string;
  relationship: string;
  role?: string;
  phone: string;
  email?: string;
  address?: string;
  hospital?: string;
  isPrimary: boolean;
  type: 'family' | 'doctor' | 'friend' | 'workplace';
  avatar?: string;
}

export const mockContacts: Contact[] = [
  {
    id: 'contact-001',
    name: 'Maria Ali',
    relationship: 'Sister',
    phone: '+234 805 123 4567',
    email: 'maria.ali@email.com',
    address: '14 Ibrahim Street, Abuja',
    isPrimary: true,
    type: 'family',
  },
  {
    id: 'contact-002',
    name: 'Dr. Sarah Johnson',
    relationship: 'Primary Care Physician',
    role: 'Doctor',
    phone: '+234 802 987 6543',
    email: 'dr.johnson@citygeneral.ng',
    hospital: 'City General Hospital',
    isPrimary: false,
    type: 'doctor',
  },
  {
    id: 'contact-003',
    name: 'Pharm. David Okafor',
    relationship: 'Pharmacist',
    role: 'Pharmacist',
    phone: '+234 806 333 2222',
    hospital: "St. Mary's Pharmacy, Wuse",
    isPrimary: false,
    type: 'doctor',
  },
  {
    id: 'contact-004',
    name: 'John Smith',
    relationship: 'Neighbor',
    phone: '+234 806 555 4444',
    isPrimary: false,
    type: 'friend',
  },
  {
    id: 'contact-005',
    name: 'HR Department',
    relationship: 'Workplace',
    role: 'HR',
    phone: '+234 9 461 0000',
    isPrimary: false,
    type: 'workplace',
  },
];
