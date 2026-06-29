export interface Appointment {
  id: string;
  type: string;
  hospital: string;
  doctor?: string;
  date: string;
  day: number;
  month: string;
  time: string;
  duration: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  notes?: string;
  preparation?: string;
}

export const mockAppointments: Appointment[] = [
  {
    id: 'appt-001',
    type: 'Full Blood Count',
    hospital: 'City General Hospital',
    doctor: 'Dr. Sarah Johnson',
    date: '24 June 2025',
    day: 24,
    month: 'JUN',
    time: '8:00 AM — 8:30 AM',
    duration: '30 min',
    status: 'confirmed',
    notes: 'Fasting required for 8 hours before test.',
    preparation: 'No food or drink except water after midnight.',
  },
  {
    id: 'appt-002',
    type: 'Blood Test Result Review',
    hospital: 'City General Hospital',
    doctor: 'Dr. Sarah Johnson',
    date: '26 June 2025',
    day: 26,
    month: 'JUN',
    time: '10:00 AM — 10:15 AM',
    duration: '15 min',
    status: 'pending',
    notes: 'Review of FBC results from previous appointment.',
  },
  {
    id: 'appt-003',
    type: 'Physiotherapy Session',
    hospital: 'Regional Emergency Clinic',
    doctor: 'Dr. Michael Chen',
    date: '28 June 2025',
    day: 28,
    month: 'JUN',
    time: '2:00 PM — 3:00 PM',
    duration: '60 min',
    status: 'confirmed',
    notes: 'Lower back pain management. Bring comfortable clothes.',
  },
  {
    id: 'appt-004',
    type: 'Dental Checkup',
    hospital: "St. Mary's Medical Center",
    doctor: 'Dr. Fatima Abdullahi',
    date: '30 June 2025',
    day: 30,
    month: 'JUN',
    time: '9:00 AM — 9:30 AM',
    duration: '30 min',
    status: 'confirmed',
    notes: 'Routine dental examination and cleaning.',
  },
];

export const pastAppointments: Appointment[] = [
  {
    id: 'appt-p001',
    type: 'Annual Physical',
    hospital: 'City General Hospital',
    doctor: 'Dr. Sarah Johnson',
    date: '15 May 2025',
    day: 15,
    month: 'MAY',
    time: '9:00 AM — 10:00 AM',
    duration: '60 min',
    status: 'completed',
    notes: 'General health checkup. All vitals normal.',
  },
  {
    id: 'appt-p002',
    type: 'Eye Examination',
    hospital: "St. Mary's Medical Center",
    date: '10 Apr 2025',
    day: 10,
    month: 'APR',
    time: '11:00 AM — 11:30 AM',
    duration: '30 min',
    status: 'completed',
    notes: 'Vision test. Prescription updated.',
  },
];

export const availableTimeSlots = [
  '9:00 AM', '10:00 AM', '11:30 AM', '2:00 PM', '3:30 PM', '4:00 PM'
];
