import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  mockPatient,
  mockAllergies,
  mockMedicalConditions,
} from '@/data/mockPatient';
import { mockContacts } from '@/data/mockContacts';
import { mockHospitals } from '@/data/mockHospitals';
import { mockAppointments, pastAppointments } from '@/data/mockAppointments';
import { mockRecords } from '@/data/mockRecords';
import { mockPrescriptions } from '@/data/mockPrescriptions';
import type {
  PatientProfile,
  Allergy,
  MedicalCondition,
} from '@/data/mockPatient';
import type { Contact } from '@/data/mockContacts';
import type { Hospital } from '@/data/mockHospitals';
import type { Appointment } from '@/data/mockAppointments';
import type { MedicalRecord } from '@/data/mockRecords';
import type { Prescription } from '@/data/mockPrescriptions';

interface PatientState {
  // Profile
  patient: PatientProfile;
  updatePatient: (updates: Partial<PatientProfile>) => void;
  setPhotoUrl: (url: string | null) => void;

  // Allergies & Conditions
  allergies: Allergy[];
  conditions: MedicalCondition[];
  addAllergy: (allergy: Omit<Allergy, 'id'>) => void;
  removeAllergy: (id: string) => void;

  // Contacts
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id'>) => void;
  removeContact: (id: string) => void;
  setPrimaryContact: (id: string) => void;

  // Hospitals
  hospitals: Hospital[];
  addHospital: (hospital: Omit<Hospital, 'id'>) => void;
  removeHospital: (id: string) => void;

  // Appointments
  appointments: Appointment[];
  pastAppointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  removeAppointment: (id: string) => void;

  // Records
  records: MedicalRecord[];
  addRecord: (record: Omit<MedicalRecord, 'id'>) => void;

  // Prescriptions
  prescriptions: Prescription[];
  addPrescription: (prescription: Omit<Prescription, 'id'>) => void;

  // Card registration & lock state
  isCardRegistered: boolean;
  isUnlocked: boolean;
  pin: string | null;
  registerCard: (pin: string) => void;
  unlockWithPin: (enteredPin: string) => boolean;
  lock: () => void;
}

export const usePatientStore = create<PatientState>()(
  persist(
    (set, get) => ({
      // Profile
      patient: { ...mockPatient },
      updatePatient: (updates) =>
        set((state) => ({
          patient: { ...state.patient, ...updates, fullName: updates.firstName || updates.lastName ? `${updates.firstName ?? state.patient.firstName} ${updates.lastName ?? state.patient.lastName}` : state.patient.fullName },
        })),
      setPhotoUrl: (url) =>
        set((state) => ({ patient: { ...state.patient, photoUrl: url } })),

      // Allergies & Conditions
      allergies: [...mockAllergies],
      conditions: [...mockMedicalConditions],
      addAllergy: (allergy) =>
        set((state) => ({
          allergies: [...state.allergies, { ...allergy, id: `allergy-${Date.now()}` }],
        })),
      removeAllergy: (id) =>
        set((state) => ({
          allergies: state.allergies.filter((a) => a.id !== id),
        })),

      // Contacts
      contacts: [...mockContacts],
      addContact: (contact) =>
        set((state) => ({
          contacts: [
            ...(contact.isPrimary ? state.contacts.map((c) => ({ ...c, isPrimary: false })) : state.contacts),
            { ...contact, id: `contact-${Date.now()}` },
          ],
        })),
      removeContact: (id) =>
        set((state) => ({
          contacts: state.contacts.filter((c) => c.id !== id),
        })),
      setPrimaryContact: (id) =>
        set((state) => ({
          contacts: state.contacts.map((c) => ({
            ...c,
            isPrimary: c.id === id,
          })),
        })),

      // Hospitals
      hospitals: [...mockHospitals],
      addHospital: (hospital) =>
        set((state) => ({
          hospitals: [...state.hospitals, { ...hospital, id: `hosp-${Date.now()}` }],
        })),
      removeHospital: (id) =>
        set((state) => ({
          hospitals: state.hospitals.filter((h) => h.id !== id),
        })),

      // Appointments
      appointments: [...mockAppointments],
      pastAppointments: [...pastAppointments],
      addAppointment: (appointment) =>
        set((state) => ({
          appointments: [...state.appointments, { ...appointment, id: `appt-${Date.now()}` }],
        })),
      updateAppointmentStatus: (id, status) =>
        set((state) => ({
          appointments: state.appointments.map((a) =>
            a.id === id ? { ...a, status } : a
          ),
        })),
      removeAppointment: (id) =>
        set((state) => ({
          appointments: state.appointments.filter((a) => a.id !== id),
        })),

      // Records
      records: [...mockRecords],
      addRecord: (record) =>
        set((state) => ({
          records: [{ ...record, id: `rec-${Date.now()}` }, ...state.records],
        })),

      // Prescriptions
      prescriptions: [...mockPrescriptions],
      addPrescription: (prescription) =>
        set((state) => ({
          prescriptions: [...state.prescriptions, { ...prescription, id: `pres-${Date.now()}` }],
        })),

      // Card registration & lock state
      isCardRegistered: false,
      isUnlocked: false,
      pin: null,
      registerCard: (pin) =>
        set({
          isCardRegistered: true,
          isUnlocked: true,
          pin,
        }),
      unlockWithPin: (enteredPin) => {
        if (get().pin === enteredPin) {
          set({ isUnlocked: true });
          return true;
        }
        return false;
      },
      lock: () => set({ isUnlocked: false }),
    }),
    {
      name: 'vitalink-patient-storage',
      partialize: (state) => ({
        patient: state.patient,
        allergies: state.allergies,
        conditions: state.conditions,
        contacts: state.contacts,
        isCardRegistered: state.isCardRegistered,
        isUnlocked: false,
        pin: state.pin,
      }),
    },
  ),
);
