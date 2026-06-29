export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  services: string[];
  is24_7: boolean;
  isGovernment: boolean;
  rating: number;
  website?: string;
}

export const mockHospitals: Hospital[] = [
  {
    id: 'hosp-001',
    name: 'City General Hospital',
    address: '12 Hospital Road, Central District, Abuja',
    phone: '+234 9 461 3000',
    services: ['Emergency', 'Cardiology', 'Pediatrics', 'Surgery', 'Radiology'],
    is24_7: true,
    isGovernment: false,
    rating: 4.5,
  },
  {
    id: 'hosp-002',
    name: 'Regional Emergency Clinic',
    address: '45 Express Way, Wuse Zone 5',
    phone: '+234 803 222 1111',
    services: ['Emergency', 'Trauma', 'ICU', 'Laboratory'],
    is24_7: true,
    isGovernment: false,
    rating: 4.2,
  },
  {
    id: 'hosp-003',
    name: "St. Mary's Medical Center",
    address: '8 Church Street, Garki',
    phone: '+234 9 876 5432',
    services: ['Maternity', 'General Practice', 'Pharmacy', 'Laboratory'],
    is24_7: false,
    isGovernment: false,
    rating: 4.0,
  },
  {
    id: 'hosp-004',
    name: 'Federal Medical Centre',
    address: '3 Independence Avenue, Central Area',
    phone: '+234 9 523 0000',
    services: ['Emergency', 'Surgery', 'Orthopedics', 'Neurology'],
    is24_7: true,
    isGovernment: true,
    rating: 4.3,
  },
];
