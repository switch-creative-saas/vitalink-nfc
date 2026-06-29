import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  Check,
  ChevronLeft,
  HeartPulse,
  Phone,
  Shield,
  User,
} from 'lucide-react';
import { usePatientStore } from '@/store/usePatientStore';
import { useLanguage } from '@/context/LanguageContext';
import { LANGUAGE_OPTIONS } from '@/components/ui/LanguageSwitcher';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import GlassToggle from '@/components/ui/GlassToggle';
import PinInput from '@/components/ui/PinInput';
import { cn } from '@/lib/utils';

const TOTAL_STEPS = 10;

const inputClass =
  'w-full h-11 px-4 rounded-2xl bg-white/50 dark:bg-vita-dark-surfaceLight/55 border border-white/30 dark:border-vita-dark-border text-sm outline-none focus:border-vita-purple dark:focus:border-vita-dark-glowSoft';

const labelClass = 'mb-1.5 block text-xs font-medium text-muted-foreground';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];
const genotypes = ['AA', 'AS', 'SS', 'AC', 'Unknown'];

export default function Register() {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const updatePatient = usePatientStore((s) => s.updatePatient);
  const addContact = usePatientStore((s) => s.addContact);
  const registerCard = usePatientStore((s) => s.registerCard);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    bloodType: '',
    height: '',
    weight: '',
    genotype: '',
    phone: '',
    email: '',
    address: '',
    state: '',
    lga: '',
    nationality: 'Nigerian',
    religion: '',
    occupation: '',
    maritalStatus: '',
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactPhone: '',
    emergencyAlerts: true,
    locationSharing: false,
    dataSharing: false,
    reminderNotifications: true,
  });
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  const updateForm = (updates: Partial<typeof form>) => {
    setForm((prev) => ({ ...prev, ...updates }));
    setError('');
  };

  const generateVitalinkId = (): string => {
    const year = new Date().getFullYear();
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `VL-${year}-${randomDigits}`;
  };

  const handlePhotoSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
    setError('');
  };

  const validateStep = () => {
    if (
      step === 2 &&
      (!form.firstName.trim() || !form.lastName.trim() || !form.dateOfBirth.trim() || !form.gender)
    ) {
      setError(t.requiredFieldsMissing ?? 'Please complete the required fields.');
      return false;
    }
    if (step === 3 && !form.bloodType) {
      setError(t.requiredFieldsMissing ?? 'Please complete the required fields.');
      return false;
    }
    if (step === 4 && !form.phone.trim()) {
      setError(t.requiredFieldsMissing ?? 'Please complete the required fields.');
      return false;
    }
    if (step === 6 && (!form.emergencyContactName.trim() || !form.emergencyContactPhone.trim())) {
      setError(t.requiredFieldsMissing ?? 'Please complete the required fields.');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (!validateStep()) return;
    setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1));
  };

  const handleBack = () => {
    setError('');
    setStep((s) => Math.max(0, s - 1));
  };

  const handleComplete = () => {
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setError(t.pinMustBe4Digits ?? t.pinMustBeFourDigits ?? 'PIN must be exactly 4 digits.');
      return;
    }
    if (pin !== confirmPin) {
      setError(t.pinsDoNotMatch ?? 'PINs do not match. Please try again.');
      setConfirmPin('');
      return;
    }

    const fullName = `${form.firstName} ${form.lastName}`.trim();

    updatePatient({
      firstName: form.firstName,
      lastName: form.lastName,
      fullName,
      dateOfBirth: form.dateOfBirth,
      bloodType: form.bloodType,
      gender: form.gender,
      height: form.height,
      weight: form.weight,
      genotype: form.genotype,
      phone: form.phone,
      email: form.email,
      address: form.address,
      state: form.state,
      lga: form.lga,
      nationality: form.nationality,
      religion: form.religion,
      occupation: form.occupation,
      maritalStatus: form.maritalStatus,
      photoUrl: photoPreview,
      vitalinkId: generateVitalinkId(),
      memberSince: new Date().getFullYear().toString(),
      emergencyAlerts: form.emergencyAlerts,
      locationSharing: form.locationSharing,
      dataSharing: form.dataSharing,
      reminderNotifications: form.reminderNotifications,
    });

    addContact({
      name: form.emergencyContactName,
      relationship: form.emergencyContactRelationship || 'Other',
      phone: form.emergencyContactPhone,
      isPrimary: true,
      type: 'family',
    });

    registerCard(pin);
    navigate('/emergency');
  };

  const progress = ((step + 1) / TOTAL_STEPS) * 100;
  const preferenceRows: Array<{
    key: 'emergencyAlerts' | 'locationSharing' | 'dataSharing' | 'reminderNotifications';
    label: string;
  }> = [
    { key: 'emergencyAlerts', label: t.emergencyAlerts ?? 'Emergency Alerts' },
    { key: 'locationSharing', label: t.locationSharing ?? 'Share Location' },
    { key: 'dataSharing', label: t.dataSharing ?? 'Data Sharing' },
    { key: 'reminderNotifications', label: t.reminderNotifications ?? 'Reminder Notifications' },
  ];

  const renderError = () =>
    error ? <p className="text-sm font-medium text-red-600 dark:text-red-300">{error}</p> : null;

  const renderActions = (options?: { showSkip?: boolean; primaryLabel?: string; onPrimary?: () => void }) => (
    <div className="space-y-3 pt-2">
      {renderError()}
      <div className="flex gap-3">
        {step > 0 && (
          <GlassButton fullWidth className="h-12" onClick={handleBack}>
            {t.back}
          </GlassButton>
        )}
        <GlassButton variant="primary" fullWidth className="h-12" onClick={options?.onPrimary ?? handleNext}>
          {options?.primaryLabel ?? t.continue}
        </GlassButton>
      </div>
      {options?.showSkip && (
        <button
          type="button"
          className="w-full text-center text-xs text-muted-foreground underline"
          onClick={handleNext}
        >
          {t.skipThisStep ?? 'Skip this step'}
        </button>
      )}
    </div>
  );

  const summarySection = (title: string, targetStep: number, rows: Array<[string, string]>) => (
    <div className="rounded-2xl bg-white/35 dark:bg-vita-dark-surfaceLight/40 border border-white/30 dark:border-vita-dark-border p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold">{title}</h3>
        <button type="button" className="text-xs font-medium text-vita-purple" onClick={() => setStep(targetStep)}>
          {t.edit}
        </button>
      </div>
      <div className="space-y-1.5">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 text-xs">
            <span className="text-muted-foreground">{label}</span>
            <span className="text-right font-medium">{value || '-'}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 24, stiffness: 280 }}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse size={22} className="text-vita-purple dark:text-vita-dark-glowSoft" />
            <span className="text-lg font-semibold">{t.appName}</span>
          </div>
          {step > 0 && (
            <GlassButton size="sm" className="text-xs" onClick={handleBack}>
              <ChevronLeft size={16} /> {t.back}
            </GlassButton>
          )}
        </div>

        <GlassCard className="p-6">
          <div className="mb-6 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t.registrationStep ?? 'Registration step'} {step + 1}/{TOTAL_STEPS}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/40 dark:bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-vita-purple dark:bg-vita-dark-glow rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {step === 0 && (
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold">{t.chooseYourLanguage}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{t.chooseLanguageDesc}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {LANGUAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => setLanguage(opt.code)}
                    className={cn(
                      'min-h-20 flex flex-col items-start justify-between p-4 rounded-2xl border-2 transition-all',
                      language === opt.code
                        ? 'border-vita-purple bg-vita-purple/10'
                        : 'border-white/50 dark:border-vita-dark-border bg-white/35 dark:bg-vita-dark-surfaceLight/40 hover:border-vita-purple/40',
                    )}
                  >
                    <span className="font-semibold">{opt.nativeLabel}</span>
                    <span className="flex w-full items-center justify-between gap-2 text-xs text-muted-foreground">
                      {opt.label}
                      {language === opt.code && <Check size={14} className="text-vita-purple" />}
                    </span>
                  </button>
                ))}
              </div>
              <GlassButton variant="primary" fullWidth className="h-12" onClick={handleNext}>
                {t.continue}
              </GlassButton>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5 text-center">
              <div>
                <h1 className="text-2xl font-bold">{t.addYourPhoto ?? 'Add your photo'}</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t.addPhotoDesc ?? 'This helps responders identify you quickly. You can skip this and add it later.'}
                </p>
              </div>
              <button
                type="button"
                className="relative w-28 h-28 mx-auto rounded-full cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                aria-label={t.addYourPhoto ?? 'Add your photo'}
              >
                <span className="w-full h-full rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-vita-purple/30 to-indigo-500/30 border-4 border-white/60 shadow-lg">
                  {photoPreview ? (
                    <img src={photoPreview} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User size={40} className="text-vita-purple" />
                  )}
                </span>
                <span className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-vita-purple text-white flex items-center justify-center">
                  <Camera size={16} />
                </span>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoSelect} />
              <div className="flex gap-3 pt-3">
                <GlassButton fullWidth className="h-12" onClick={handleNext}>
                  {t.skipForNow ?? 'Skip for now'}
                </GlassButton>
                <GlassButton variant="primary" fullWidth className="h-12" onClick={handleNext}>
                  {t.continue}
                </GlassButton>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold">{t.basicIdentity ?? t.personalInformation}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{t.registrationPersonalDesc}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input className={inputClass} value={form.firstName} onChange={(e) => updateForm({ firstName: e.target.value })} placeholder={t.firstName} />
                <input className={inputClass} value={form.lastName} onChange={(e) => updateForm({ lastName: e.target.value })} placeholder={t.lastName} />
              </div>
              <input className={inputClass} value={form.dateOfBirth} onChange={(e) => updateForm({ dateOfBirth: e.target.value })} placeholder={t.dateOfBirth} />
              <select className={inputClass} value={form.gender} onChange={(e) => updateForm({ gender: e.target.value })}>
                <option value="">{t.selectGender ?? 'Select gender'}</option>
                <option value="Male">{t.male ?? 'Male'}</option>
                <option value="Female">{t.female ?? 'Female'}</option>
                <option value="Prefer not to say">{t.preferNotToSay ?? 'Prefer not to say'}</option>
              </select>
              {renderActions()}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold">{t.physicalMedicalBasics ?? 'Physical & medical basics'}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{t.bloodTypeImportance}</p>
              </div>
              <div>
                <label className={labelClass}>{t.bloodType}</label>
                <select className={inputClass} value={form.bloodType} onChange={(e) => updateForm({ bloodType: e.target.value })}>
                  <option value="">{t.bloodType}</option>
                  {bloodTypes.map((type) => (
                    <option key={type} value={type}>{type === 'Unknown' ? t.unknown ?? 'Unknown' : type}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>{t.height} <span className="font-normal">({t.optional ?? 'optional'})</span></label>
                  <input className={inputClass} value={form.height} onChange={(e) => updateForm({ height: e.target.value })} placeholder="cm" inputMode="numeric" />
                </div>
                <div>
                  <label className={labelClass}>{t.weight} <span className="font-normal">({t.optional ?? 'optional'})</span></label>
                  <input className={inputClass} value={form.weight} onChange={(e) => updateForm({ weight: e.target.value })} placeholder="kg" inputMode="numeric" />
                </div>
              </div>
              <div>
                <label className={labelClass}>{t.genotype ?? 'Genotype'} <span className="font-normal">({t.optional ?? 'optional'})</span></label>
                <select className={inputClass} value={form.genotype} onChange={(e) => updateForm({ genotype: e.target.value })}>
                  <option value="">{t.genotype ?? 'Genotype'}</option>
                  {genotypes.map((type) => (
                    <option key={type} value={type}>{type === 'Unknown' ? t.unknown ?? 'Unknown' : type}</option>
                  ))}
                </select>
              </div>
              {renderActions()}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold">{t.contactInformation}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{t.contactInformationDesc ?? 'Add the best ways to reach you.'}</p>
              </div>
              <input className={inputClass} value={form.phone} onChange={(e) => updateForm({ phone: e.target.value })} placeholder={t.phone} type="tel" />
              <input className={inputClass} value={form.email} onChange={(e) => updateForm({ email: e.target.value })} placeholder={t.email} type="email" />
              <input className={inputClass} value={form.address} onChange={(e) => updateForm({ address: e.target.value })} placeholder={t.address} />
              <div className="grid grid-cols-2 gap-3">
                <input className={inputClass} value={form.state} onChange={(e) => updateForm({ state: e.target.value })} placeholder={t.state ?? 'State'} />
                <input className={inputClass} value={form.lga} onChange={(e) => updateForm({ lga: e.target.value })} placeholder={t.lga ?? 'LGA'} />
              </div>
              {renderActions()}
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold">{t.backgroundInformation ?? 'Background information'}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{t.backgroundInformationDesc ?? 'These details can be added now or later.'}</p>
              </div>
              <input className={inputClass} value={form.nationality} onChange={(e) => updateForm({ nationality: e.target.value })} placeholder={t.nationality} />
              <select className={inputClass} value={form.religion} onChange={(e) => updateForm({ religion: e.target.value })}>
                <option value="">{t.religion ?? 'Religion'}</option>
                <option value="Islam">{t.islam ?? 'Islam'}</option>
                <option value="Christianity">{t.christianity ?? 'Christianity'}</option>
                <option value="Traditional">{t.traditional ?? 'Traditional'}</option>
                <option value="Other">{t.other}</option>
                <option value="Prefer not to say">{t.preferNotToSay ?? 'Prefer not to say'}</option>
              </select>
              <input className={inputClass} value={form.occupation} onChange={(e) => updateForm({ occupation: e.target.value })} placeholder={t.occupation} />
              <select className={inputClass} value={form.maritalStatus} onChange={(e) => updateForm({ maritalStatus: e.target.value })}>
                <option value="">{t.maritalStatus}</option>
                <option value="Single">{t.single ?? 'Single'}</option>
                <option value="Married">{t.married ?? 'Married'}</option>
                <option value="Divorced">{t.divorced ?? 'Divorced'}</option>
                <option value="Widowed">{t.widowed ?? 'Widowed'}</option>
              </select>
              {renderActions({ showSkip: true })}
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-red-500/15 flex items-center justify-center">
                  <Phone size={20} className="text-red-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{t.emergencyContact}</h1>
                  <p className="text-sm text-muted-foreground">{t.registrationEmergencyDesc}</p>
                </div>
              </div>
              <input className={inputClass} value={form.emergencyContactName} onChange={(e) => updateForm({ emergencyContactName: e.target.value })} placeholder={t.contactName} />
              <select className={inputClass} value={form.emergencyContactRelationship} onChange={(e) => updateForm({ emergencyContactRelationship: e.target.value })}>
                <option value="">{t.relationship}</option>
                <option value="Spouse">{t.spouse ?? 'Spouse'}</option>
                <option value="Parent">{t.parent ?? 'Parent'}</option>
                <option value="Sibling">{t.sibling ?? 'Sibling'}</option>
                <option value="Child">{t.child ?? 'Child'}</option>
                <option value="Friend">{t.friend}</option>
                <option value="Other">{t.other}</option>
              </select>
              <input className={inputClass} value={form.emergencyContactPhone} onChange={(e) => updateForm({ emergencyContactPhone: e.target.value })} placeholder={t.phoneNumber ?? t.phone} type="tel" />
              {renderActions()}
            </div>
          )}

          {step === 7 && (
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold">{t.notificationPrivacyPreferences ?? 'Notification & privacy preferences'}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{t.notificationPrivacyDesc ?? 'Choose how VitaLink can alert and share data.'}</p>
              </div>
              {preferenceRows.map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between rounded-2xl bg-white/35 dark:bg-vita-dark-surfaceLight/40 border border-white/30 dark:border-vita-dark-border px-4 py-3">
                  <span className="text-sm font-medium">{label}</span>
                  <GlassToggle
                    checked={form[key]}
                    onChange={(checked) => updateForm({ [key]: checked })}
                  />
                </div>
              ))}
              {renderActions()}
            </div>
          )}

          {step === 8 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-vita-purple/15 flex items-center justify-center">
                  <Shield size={20} className="text-vita-purple" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{t.setPin}</h1>
                  <p className="text-sm text-muted-foreground">{t.setPinDesc}</p>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">{t.pin}</label>
                <PinInput value={pin} onChange={(value) => { setPin(value); setError(''); }} hasError={!!error} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">{t.confirmPin}</label>
                <PinInput value={confirmPin} onChange={(value) => { setConfirmPin(value); setError(''); }} hasError={!!error} />
              </div>
              {renderActions({ primaryLabel: t.reviewYourInfo ?? 'Review your information' })}
            </div>
          )}

          {step === 9 && (
            <div className="space-y-4">
              <div>
                <h1 className="text-xl font-bold">{t.reviewYourInfo ?? 'Review your information'}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{t.reviewYourInfoDesc ?? 'Check your details before completing setup.'}</p>
              </div>
              {summarySection(t.basicIdentity ?? t.personalInformation ?? 'Basic identity', 2, [
                [t.fullName ?? 'Full name', `${form.firstName} ${form.lastName}`.trim()],
                [t.dateOfBirth ?? 'Date of Birth', form.dateOfBirth],
                [t.gender ?? 'Gender', form.gender],
              ])}
              {summarySection(t.physicalMedicalBasics ?? 'Physical & medical basics', 3, [
                [t.bloodType ?? 'Blood Type', form.bloodType],
                [t.height ?? 'Height', form.height ? `${form.height} cm` : ''],
                [t.weight ?? 'Weight', form.weight ? `${form.weight} kg` : ''],
                [t.genotype ?? 'Genotype', form.genotype],
              ])}
              {summarySection(t.contactInformation ?? 'Contact Information', 4, [
                [t.phone ?? 'Phone', form.phone],
                [t.email ?? 'Email', form.email],
                [t.address ?? 'Address', form.address],
                [t.state ?? 'State', form.state],
                [t.lga ?? 'LGA', form.lga],
              ])}
              {summarySection(t.emergencyContact ?? 'Emergency Contact', 6, [
                [t.contactName ?? 'Contact name', form.emergencyContactName],
                [t.relationship ?? 'Relationship', form.emergencyContactRelationship || 'Other'],
                [t.phone ?? 'Phone', form.emergencyContactPhone],
              ])}
              {renderError()}
              <div className="flex gap-3 pt-2">
                <GlassButton fullWidth className="h-12" onClick={handleBack}>
                  {t.back}
                </GlassButton>
                <GlassButton variant="primary" fullWidth className="h-12" onClick={handleComplete}>
                  {t.completeSetup}
                </GlassButton>
              </div>
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}
