export interface Prescription {
  id: string;
  medication: string;
  genericName: string;
  dosage: string;
  frequency: string;
  duration: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'expired';
  prescribedBy: string;
  hospital: string;
  pharmacy?: string;
  refills: number;
  refillsRemaining: number;
  sideEffects?: string;
  qrValue: string;
}

export const mockPrescriptions: Prescription[] = [
  {
    id: 'pres-001',
    medication: 'Amoxicillin 500mg',
    genericName: 'Amoxicillin Trihydrate',
    dosage: '500mg',
    frequency: '3 times daily after meals',
    duration: '14 days',
    startDate: '20 Jun 2025',
    status: 'active',
    prescribedBy: 'Dr. Sarah Johnson',
    hospital: 'City General Hospital',
    refills: 2,
    refillsRemaining: 2,
    sideEffects: 'May cause nausea or diarrhea',
    qrValue: 'VL-PRES-2024-001',
  },
  {
    id: 'pres-002',
    medication: 'Lisinopril 10mg',
    genericName: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily in the morning',
    duration: 'Ongoing',
    startDate: '15 Jan 2023',
    status: 'active',
    prescribedBy: 'Dr. Emmanuel Okonkwo',
    hospital: 'City General Hospital',
    refills: -1,
    refillsRemaining: -1,
    sideEffects: 'May cause dry cough or dizziness',
    qrValue: 'VL-PRES-2024-002',
  },
  {
    id: 'pres-003',
    medication: 'Metformin 500mg',
    genericName: 'Metformin Hydrochloride',
    dosage: '500mg',
    frequency: 'Twice daily with meals',
    duration: 'Ongoing',
    startDate: '10 Mar 2021',
    status: 'active',
    prescribedBy: 'Dr. Sarah Johnson',
    hospital: 'City General Hospital',
    refills: -1,
    refillsRemaining: -1,
    sideEffects: 'May cause stomach upset initially',
    qrValue: 'VL-PRES-2024-003',
  },
  {
    id: 'pres-004',
    medication: 'Ibuprofen 400mg',
    genericName: 'Ibuprofen',
    dosage: '400mg',
    frequency: 'As needed for pain',
    duration: '5 days',
    startDate: '10 Jun 2025',
    endDate: '15 Jun 2025',
    status: 'completed',
    prescribedBy: 'Dr. Michael Chen',
    hospital: 'Regional Emergency Clinic',
    refills: 0,
    refillsRemaining: 0,
    qrValue: 'VL-PRES-2024-004',
  },
  {
    id: 'pres-005',
    medication: 'Cetirizine 10mg',
    genericName: 'Cetirizine Hydrochloride',
    dosage: '10mg',
    frequency: 'Once daily at bedtime',
    duration: '30 days',
    startDate: '1 May 2025',
    endDate: '1 Jun 2025',
    status: 'completed',
    prescribedBy: 'Dr. Sarah Johnson',
    hospital: 'City General Hospital',
    refills: 0,
    refillsRemaining: 0,
    qrValue: 'VL-PRES-2024-005',
  },
  {
    id: 'pres-006',
    medication: 'Azithromycin 250mg',
    genericName: 'Azithromycin',
    dosage: '250mg',
    frequency: 'Once daily',
    duration: '5 days',
    startDate: '26 Dec 2023',
    endDate: '30 Dec 2023',
    status: 'expired',
    prescribedBy: 'Dr. Aisha Mohammed',
    hospital: 'Regional Emergency Clinic',
    refills: 0,
    refillsRemaining: 0,
    sideEffects: 'May cause stomach upset',
    qrValue: 'VL-PRES-2024-006',
  },
];
