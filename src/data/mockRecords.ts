export interface MedicalRecord {
  id: string;
  title: string;
  hospital: string;
  doctor?: string;
  date: string;
  type: 'lab' | 'imaging' | 'vaccination' | 'consultation';
  status: 'normal' | 'abnormal' | 'pending';
  notes: string;
  results?: RecordResult[];
  attachedFiles?: AttachedFile[];
}

export interface RecordResult {
  name: string;
  value: string;
  unit: string;
  range: string;
  isAbnormal: boolean;
}

export interface AttachedFile {
  name: string;
  size: string;
  type: string;
}

export const mockRecords: MedicalRecord[] = [
  {
    id: 'rec-001',
    title: 'Flu Vaccination 2025-2026',
    hospital: 'City General Hospital',
    doctor: 'Dr. Sarah Johnson',
    date: '12 Jun 2025',
    type: 'vaccination',
    status: 'normal',
    notes: 'Annual influenza vaccination administered. Quadrivalent vaccine (Afluria Quad). No adverse reactions observed. Patient advised to return if any flu-like symptoms develop within 48 hours.',
    attachedFiles: [
      { name: 'vaccination_cert.pdf', size: '156 KB', type: 'pdf' },
    ],
  },
  {
    id: 'rec-002',
    title: 'Cardiology Consultation',
    hospital: 'City General Hospital',
    doctor: 'Dr. Emmanuel Okonkwo',
    date: '3 May 2025',
    type: 'consultation',
    status: 'normal',
    notes: 'Routine cardiology review. Blood pressure 128/82. ECG normal sinus rhythm. No chest pain reported. Continue current medication. Follow-up in 6 months.',
  },
  {
    id: 'rec-003',
    title: 'Chest X-Ray',
    hospital: 'Regional Emergency Clinic',
    doctor: 'Dr. Aisha Mohammed',
    date: '28 Apr 2025',
    type: 'imaging',
    status: 'normal',
    notes: 'Chest X-ray PA view. Lungs clear. No evidence of infiltrates, masses, or pleural effusion. Cardiac silhouette normal. Bony structures intact.',
    attachedFiles: [
      { name: 'chest_xray_pa.jpg', size: '2.4 MB', type: 'image' },
      { name: 'radiologist_report.pdf', size: '89 KB', type: 'pdf' },
    ],
  },
  {
    id: 'rec-004',
    title: 'Complete Blood Count (CBC)',
    hospital: 'City General Hospital',
    doctor: 'Dr. Sarah Johnson',
    date: '15 Mar 2025',
    type: 'lab',
    status: 'abnormal',
    notes: 'Some values slightly outside reference range. Follow-up recommended in 4 weeks.',
    results: [
      { name: 'Hemoglobin', value: '11.2', unit: 'g/dL', range: '12.0-15.5', isAbnormal: true },
      { name: 'WBC', value: '7.5', unit: 'x10^9/L', range: '4.5-11.0', isAbnormal: false },
      { name: 'RBC', value: '4.1', unit: 'x10^12/L', range: '4.0-5.5', isAbnormal: false },
      { name: 'Platelets', value: '250', unit: 'x10^9/L', range: '150-400', isAbnormal: false },
    ],
    attachedFiles: [
      { name: 'cbc_results.pdf', size: '134 KB', type: 'pdf' },
    ],
  },
  {
    id: 'rec-005',
    title: 'Eye Examination',
    hospital: "St. Mary's Medical Center",
    doctor: 'Dr. Grace Udo',
    date: '2 Feb 2025',
    type: 'consultation',
    status: 'normal',
    notes: 'Visual acuity 20/20 both eyes. Intraocular pressure normal. Fundoscopy clear. Prescription updated: R: -0.50, L: -0.25. No signs of diabetic retinopathy.',
  },
  {
    id: 'rec-006',
    title: 'COVID-19 Booster (Pfizer)',
    hospital: 'Federal Medical Centre',
    doctor: 'Nurse Blessing Ade',
    date: '10 Jan 2025',
    type: 'vaccination',
    status: 'normal',
    notes: 'COVID-19 booster dose (Pfizer-BioNTech bivalent BA.4/5). Batch #PF78432. Administered in left deltoid. Observed for 15 minutes. No immediate adverse reactions.',
  },
  {
    id: 'rec-007',
    title: 'Lipid Panel',
    hospital: 'City General Hospital',
    doctor: 'Dr. Sarah Johnson',
    date: '5 Dec 2024',
    type: 'lab',
    status: 'normal',
    notes: 'All lipid values within target range. Continue current diet and exercise regimen.',
    results: [
      { name: 'Total Cholesterol', value: '185', unit: 'mg/dL', range: '<200', isAbnormal: false },
      { name: 'LDL', value: '110', unit: 'mg/dL', range: '<130', isAbnormal: false },
      { name: 'HDL', value: '55', unit: 'mg/dL', range: '>40', isAbnormal: false },
      { name: 'Triglycerides', value: '130', unit: 'mg/dL', range: '<150', isAbnormal: false },
    ],
  },
];
