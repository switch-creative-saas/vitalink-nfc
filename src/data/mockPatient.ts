export interface PatientProfile {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  vitalinkId: string;
  dateOfBirth: string;
  bloodType: string;
  gender: string;
  height: string;
  weight: string;
  genotype: string;
  phone: string;
  email: string;
  address: string;
  state: string;
  lga: string;
  nationality: string;
  religion: string;
  occupation: string;
  maritalStatus: string;
  photoUrl: string | null;
  memberSince: string;
  emergencyAlerts: boolean;
  locationSharing: boolean;
  dataSharing: boolean;
  reminderNotifications: boolean;
}

export interface Allergy {
  id: string;
  name: string;
  severity: 'severe' | 'moderate' | 'mild';
  reaction: string;
  management: string;
  icon: string;
}

export interface MedicalCondition {
  id: string;
  name: string;
  status: 'chronic' | 'managed' | 'active' | 'resolved';
  description: string;
  icon: string;
}

export const mockPatient: PatientProfile = {
  id: 'patient-001',
  firstName: 'Amina',
  lastName: 'Bello',
  fullName: 'Amina Bello',
  vitalinkId: 'VL-2024-8841',
  dateOfBirth: '15 March 1988',
  bloodType: 'O+',
  gender: 'Female',
  height: '165',
  weight: '68',
  genotype: 'AA',
  phone: '+234 803 456 7890',
  email: 'amina.bello@email.com',
  address: '12 Independence Avenue, Abuja',
  state: 'FCT',
  lga: 'Abuja Municipal',
  nationality: 'Nigerian',
  religion: 'Islam',
  occupation: 'Civil Servant',
  maritalStatus: 'Married',
  photoUrl: null,
  memberSince: '2023',
  emergencyAlerts: true,
  locationSharing: false,
  dataSharing: true,
  reminderNotifications: true,
};

export const mockAllergies: Allergy[] = [
  {
    id: 'allergy-001',
    name: 'Peanuts',
    severity: 'severe',
    reaction: 'Anaphylaxis — throat swelling, difficulty breathing',
    management: 'Avoid all peanut products. Carry epinephrine auto-injector.',
    icon: 'Pill',
  },
  {
    id: 'allergy-002',
    name: 'Penicillin',
    severity: 'severe',
    reaction: 'Severe rash, difficulty breathing',
    management: 'Use alternative antibiotics (macrolides, fluoroquinolones)',
    icon: 'Pill',
  },
  {
    id: 'allergy-003',
    name: 'Shellfish',
    severity: 'severe',
    reaction: 'Anaphylaxis — throat swelling, difficulty breathing',
    management: 'Avoid all shellfish. Carry epinephrine auto-injector.',
    icon: 'Fish',
  },
  {
    id: 'allergy-004',
    name: 'Latex',
    severity: 'moderate',
    reaction: 'Contact dermatitis, hives',
    management: 'Use latex-free gloves and medical products.',
    icon: 'Hand',
  },
  {
    id: 'allergy-005',
    name: 'Eggs',
    severity: 'moderate',
    reaction: 'Digestive upset, mild rash',
    management: 'Avoid raw or undercooked eggs.',
    icon: 'Egg',
  },
  {
    id: 'allergy-006',
    name: 'Dust',
    severity: 'mild',
    reaction: 'Sneezing, nasal congestion',
    management: 'Use air purifier, regular cleaning.',
    icon: 'Wind',
  },
  {
    id: 'allergy-007',
    name: 'Pollen',
    severity: 'mild',
    reaction: 'Seasonal sneezing, watery eyes',
    management: 'Antihistamines during pollen season.',
    icon: 'Flower2',
  },
  {
    id: 'allergy-008',
    name: 'Cats',
    severity: 'mild',
    reaction: 'Sneezing, itchy eyes',
    management: 'Limit exposure, wash hands after contact.',
    icon: 'Cat',
  },
];

export const mockMedicalConditions: MedicalCondition[] = [
  {
    id: 'cond-001',
    name: 'Asthma',
    status: 'chronic',
    description: 'Persistent asthma since childhood. Uses salbutamol inhaler as needed.',
    icon: 'Wind',
  },
  {
    id: 'cond-002',
    name: 'Hypertension',
    status: 'managed',
    description: 'Diagnosed 2019. On lisinopril 10mg daily. BP well controlled.',
    icon: 'Activity',
  },
  {
    id: 'cond-003',
    name: 'Type 2 Diabetes',
    status: 'managed',
    description: 'Diagnosed 2021. On metformin 500mg twice daily.',
    icon: 'Droplet',
  },
];
